const OrderService = require("../services/OrderService")

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, deliveryMethod } = req.body;

        // Kiểm tra xem các giá trị có phải là undefined hoặc null
        if (paymentMethod == null || itemsPrice == null || shippingPrice == null || totalPrice == null || fullName == null || address == null || city == null || phone == null || deliveryMethod == null) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        // Nếu tất cả các giá trị đều hợp lệ, tiếp tục xử lý
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
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