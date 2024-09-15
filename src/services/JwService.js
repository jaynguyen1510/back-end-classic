const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const generalAccessToken = async ({ id, isAdmin }) => {
    const access_token = jwt.sign({ id, isAdmin }, process.env.ACCESS_TOKEN, { expiresIn: '10s' });
    return access_token;
};

const generalRefreshToken = async ({ id, isAdmin }) => {
    const refresh_token = jwt.sign({ id, isAdmin }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return refresh_token;
};

const refreshTokenJwtService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Log token và secret key để kiểm tra
            console.log("Token received for verification:", token);

            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log("Verification error:", err);
                    resolve({
                        status: "ERR",
                        message: "INVALID_TOKEN"
                    });
                } else {
                    const access_token = await generalAccessToken({
                        id: user?.id,
                        isAdmin: user?.isAdmin
                    });
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        access_token
                    });
                }
            });
        } catch (e) {
            console.error("Unexpected error during token verification:", e);
            reject(e);
        }
    });
};



module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}
