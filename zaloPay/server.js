const express = require('express');
const app = express();
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const bodyParser = require('body-parser'); // npm install body-parser
const moment = require('moment'); // npm install moment
const e = require('express');
const qs = require('qs')
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;

// APP INFO
const config = {
    app_id: "553",
    key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
    key2: "eG4r0GcoNtRGbO8",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    endpoint2: "https://sb-openapi.zalopay.vn/v2/query"
};

app.post("/create-zalopay-payment", async (req, res) => {
    const embed_data = {
        redirecturl: "https://docs.zalopay.vn/result",
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: "https://4a88-171-252-153-234.ngrok-free.app/callback"
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order })
        console.log("res", result.data);

    } catch (error) {
        console.log(error.message);

    }
})

app.post("/callback", (req, res) => {
    let result = {};
    console.log('Request body:', req.body);

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        console.log('Received dataStr:', dataStr);
        console.log('Received reqMac:', reqMac);

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('Generated mac:', mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr);
            console.log("Update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

app.post("/order-success/:app_trans_id", async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, // Input your app_trans_id
    }

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
        const result = await axios(postConfig)
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error.message);

    }
})

app.listen(port, () => {
    console.log("server is running on port " + port);
});