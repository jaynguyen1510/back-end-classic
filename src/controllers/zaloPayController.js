const zaloPayService = require('../services/zaloPayService');

const createZaloPayPayment = async (req, res) => {
    // console.log("Dữ liệu đầu vào:", req.body); // Log dữ liệu nhận từ client

    try {
        const orderDetails = req.body; // Nhận orderDetails từ request body

        // Gọi dịch vụ tạo thanh toán ZaloPay với orderDetails
        const result = await zaloPayService.createPayment(orderDetails);
        // console.log("Kết quả từ zaloPayService:", result); // Log kết quả từ dịch vụ

        // Trả lại kết quả cho client
        res.json(result);
    } catch (error) {
        console.error('Lỗi khi tạo thanh toán ZaloPay:', error); // Log lỗi chi tiết
        res.status(500).send({ error: error.message });
    }
};




const handleCallback = (req, res) => {
    try {
        const callbackData = req.body;
        zaloPayService.handleCallback(callbackData, res); // Đảm bảo res được truyền vào
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
const orderSuccess = async (req, res) => {
    try {
        const app_trans_id = req.params.app_trans_id;
        const result = await zaloPayService.orderSuccess(app_trans_id);
        res.json(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
module.exports = {
    createZaloPayPayment,
    handleCallback,
    orderSuccess
};
