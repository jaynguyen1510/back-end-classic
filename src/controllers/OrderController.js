const OrderService = require("../services/OrderService")

const createOrder = async (req, res) => {
    console.log("Create Order", req.body);
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, deliveryMethod } = req.body;

        if (!paymentMethod || !itemsPrice || shippingPrice == null || !totalPrice || !fullName || !address || !city || !phone || deliveryMethod == null) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        console.log(req.body);

        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error creating order:", e.message);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error'
        });
    }
};


const getAllOrderDetails = async (req, res) => {

    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: "The userId is required"
            })
        }
        const response = await OrderService.getAllOrderDetails(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailsOrder = async (req, res) => {

    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: "The orderId is required"
            })
        }
        const response = await OrderService.getDetailsOrder(orderId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelDetailsOrder = async (req, res) => {

    try {
        const orderId = req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: "The orderId is required"
            })
        }
        // console.log("data", data);
        const response = await OrderService.cancelDetailsOrder(orderId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}
module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelDetailsOrder
}