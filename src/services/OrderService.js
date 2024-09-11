const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderSelected,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            address,
            fullName,
            city,
            isPaid,
            paidAt,
            email,
            phone,
            user,
            deliveryMethod, // Get deliveryMethod from newOrder
        } = newOrder;

        try {
            const promise = orderSelected.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount },
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount,
                        },
                    },
                    {
                        new: true,
                    }
                );

                if (!productData) {
                    // Return an object with an error status if productData is not found
                    return {
                        status: "error",
                        message: `Product with ID ${order.product} does not have enough stock.`,
                        id: order.product,
                    };
                }
            });

            const result = await Promise.all(promise);
            const failedItems = result.filter((item) => item?.status === "error");

            if (failedItems.length) {
                // If any product failed due to insufficient stock, resolve with a detailed message
                resolve({
                    status: "error",
                    message: `The following products do not have enough stock: ${failedItems.map(
                        (item) => item.id
                    ).join(", ")}.`,
                });
                return;
            }

            if (!user) {
                throw new Error("User is required");
            }

            // Create the order after all product stock validations have passed
            const createdOrder = await Order.create({
                orderSelected,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone,
                },
                paymentMethod,
                deliveryMethod, // Add deliveryMethod here
                itemsPrice,
                shippingPrice,
                isPaid,
                paidAt,
                totalPrice,
                user, // Add user to the order
            });
            await EmailService.sendEmailCreateOrder(email, orderSelected, fullName, shippingPrice, itemsPrice, totalPrice);
            if (createdOrder) {
                resolve({
                    status: "OK",
                    message: "Order created successfully.",
                });
            }

        } catch (e) {
            console.error("Error creating order:", e.message); // Log the detailed error to the console
            reject({
                status: "error",
                message: e.message,
            });
        }
    });
};

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderProduct = await Order.find({
                user: id
            });
            if (orderProduct === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: orderProduct
            });

        } catch (e) {
            console.log("e", e);
            reject(e)
        }
    })
}
const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderProduct = await Order.findById({
                _id: id
            });
            if (orderProduct === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: orderProduct
            });

        } catch (e) {
            console.log("e", e);
            reject(e)
        }
    })
}
const cancelDetailsOrder = async (id, data) => {
    try {
        // Xử lý cập nhật số lượng tồn kho cho các sản phẩm trong đơn hàng
        const failedItems = [];
        for (const order of data) {
            const productData = await Product.findOneAndUpdate(
                { _id: order.product },
                {
                    $inc: {
                        countInStock: +order.amount, // Tăng số lượng tồn kho
                        selled: -order.amount, // Giảm số lượng đã bán
                    },
                },
                { new: true }
            );

            if (!productData) {
                failedItems.push(order.product);
            }
        }

        if (failedItems.length) {
            return {
                status: 'ERR',
                message: `Các sản phẩm với ID ${failedItems.join(", ")} không tồn tại hoặc không thể cập nhật.`,
            };
        }

        // Xóa đơn hàng sau khi tất cả các sản phẩm đã được cập nhật
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return {
                status: 'ERR',
                message: 'Xóa đơn hàng thất bại',
            };
        }

        return {
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: deletedOrder,
        };
    } catch (e) {
        console.error("Lỗi khi hủy đơn hàng:", e.message);
        return {
            status: 'ERR',
            message: e.message,
        };
    }
};


module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelDetailsOrder
}