require('dotenv').config();

module.exports = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    endpoint2: "https://sb-openapi.zalopay.vn/v2/query"
};
