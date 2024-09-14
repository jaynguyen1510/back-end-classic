const zaloPayService = require('../services/zaloPayService');
// create
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

// refund 
const refundOrderZaloPay = async (req, res) => {
    const { zp_trans_id, amount, description } = req.params; // Lấy các tham số từ URL

    try {
        // Gọi service để thực hiện refund
        const result = await zaloPayService.refundOrderZaloPay(zp_trans_id, amount, description);
        return res.status(200).json(result); // Trả về kết quả thành công
    } catch (error) {
        return res.status(500).json({ message: error.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
};

// Controller to handle refund status query
const queryRefundZaloPay = async (req, res) => {
    const { m_refund_id } = req.params; // Get m_refund_id from the URL
    console.log("test", { m_refund_id });

    try {
        // Call service to query refund status
        const result = await zaloPayService.queryRefundZaloPay(m_refund_id);
        return res.status(200).json(result); // Return success response
    } catch (error) {
        return res.status(500).json({ message: error.message }); // Return error response
    }
};

module.exports = {
    createZaloPayPayment,
    handleCallback,
    orderSuccess,
    refundOrderZaloPay,
    queryRefundZaloPay
};