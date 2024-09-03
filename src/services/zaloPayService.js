const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const config = require('../config/zaloPayConfig');
const qs = require('qs')

const createPayment = async (orderDetails) => {


    const items = [{}];
    const orderItems = orderDetails.orderSelected;

    // Tạo ID giao dịch ngẫu nhiên
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`
    // Tạo mô tả đơn hàng với tên sản phẩm đầu tiên (nếu có)
    const productName = orderItems.length > 0 ? orderItems[0].name : "Unknown Product";
    const description = `Thanh toán đơn hàng ${productName}`;
    // Xử lý số tiền, đảm bảo giá trị là số nguyên hoặc thập phân hợp lệ

    const parseAmount = (amountStr) => {
        // Đảm bảo `amountStr` là chuỗi
        const amountString = String(amountStr);

        // Loại bỏ ký tự không phải số và dấu phân cách nghìn
        const cleanedString = amountString
            .replace(/,/g, '')    // Xóa dấu phân cách nghìn
            .split('.')[0];       // Lấy phần trước dấu chấm (nếu có)

        return parseInt(cleanedString, 10);
    };

    const roundAmount = (amountStr) => {
        // Đảm bảo `amountStr` là chuỗi
        const amountString = String(amountStr);

        // Chuyển đổi số tiền thành số nguyên
        const amount = parseAmount(amountString);

        // Tách phần thập phân để xác định việc làm tròn
        const decimalPart = amountString.split('.')[1];
        const fraction = decimalPart ? parseInt(decimalPart.charAt(0), 10) : 0;

        // Làm tròn số
        if (fraction >= 5) {
            return amount + 1;
        }
        return amount;
    };

    // Xử lý số tiền từ `orderDetails.itemsPrice`, ví dụ: "34.555,3" sẽ thành "34556"
    const amount = orderDetails.itemsPrice
        ? roundAmount(orderDetails.itemsPrice)
        : 5000000; // Ví dụ: 50,000.00 VND = 5000000



    // Khai báo và khởi tạo `embed_data` trước khi sử dụng
    const embed_data = {
        redirecturl: `http://localhost:3000/payment?app_trans_id=${app_trans_id}`, // Sử dụng `transID` thay vì `order.app_trans_id` vì `order` chưa được khai báo
    };
    const order = { // Đảm bảo rằng `order` được khai báo và khởi tạo tại đây
        app_id: config.app_id,
        app_trans_id: app_trans_id,
        app_user: orderDetails.user || "user123",
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: description,
        bank_code: "",
        callback_url: " https://7895-171-252-155-58.ngrok-free.app/api/zalopay/callback"
    };

    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    console.log("order = ", order);


    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        console.log("result", result.data);

        return { redirect_url: result.data };
    } catch (error) {
        console.log("Lỗi =", error.message);
        throw new Error(error.message);
    }
};


const handleCallback = (callbackData, res) => {
    console.log("callbackData =", callbackData); // Kiểm tra dữ liệu đầu vào

    let result = {};

    try {
        let dataStr = callbackData.data;
        let reqMac = callbackData.mac;

        console.log("dataStr =", dataStr); // Kiểm tra dữ liệu

        // Tính toán MAC từ dữ liệu và so sánh với MAC yêu cầu
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);

        if (reqMac !== mac) {
            // Callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // Thanh toán thành công, cập nhật trạng thái đơn hàng
            let dataJson = JSON.parse(dataStr);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // Thông báo kết quả cho ZaloPay server
    res.json(result);
};

const orderSuccess = async (app_trans_id) => {
    console.log("app_trans_id = ", app_trans_id);

    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id,
    };

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: config.endpoint2,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    try {
        const result = await axios(postConfig);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createPayment,
    handleCallback,
    orderSuccess
};
