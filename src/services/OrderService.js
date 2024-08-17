const Order = require("../models/OrderProductModel");

const bcrypt = require("bcrypt");

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        console.log("newOrder", newOrder);
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, address, fullName, city, phone, user } = newOrder

        try {
            if (!user) {
                throw new Error("User is required");
            }
            const createOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user // Thêm thông tin người dùng vào đối tượng đơn hàng
            });
            if (createOrder) {
                resolve({
                    status: "OK",
                    message: "create Order success",
                    data: createOrder
                })

            }

        } catch (e) {
            console.error("Error creating order:", e.message); // In lỗi chi tiết ra console
            reject({
                status: "error",
                message: e.message
            });
        }
    })
}


module.exports = {
    createOrder
}