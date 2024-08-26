const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");

const bcrypt = require("bcrypt");

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
                totalPrice,
                user, // Add user to the order
            });

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
const cancelDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundOrder = await Order.findOne({
                _id: id
            });
            if (foundOrder === null) {
                resolve({
                    status: "ERR",
                    message: "The order is not defined",
                })
            }
            await Order.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETE order SUCCESS",
                data: foundOrder
            });
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelDetailsOrder
}