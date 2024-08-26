const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    // Kiểm tra xem token có tồn tại không
    const tokenHeader = req.headers.token;
    if (!tokenHeader) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }

    // Tách token từ header
    const token = tokenHeader.split(' ')[1];
    console.log('Token:', token); // Log token ra console

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'Unauthorized',
                status: 'ERROR'
            });
        }
    });
};


const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    });
}

const authMiddleWareOrder = (req, res, next) => {
    const authHeader = req.headers.token;

    // Kiểm tra xem token có tồn tại
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR',
        });
    }

    const token = authHeader.split(' ')[1];

    // Kiểm tra xem token có đúng định dạng không
    if (!token) {
        return res.status(401).json({
            message: 'Invalid token format',
            status: 'ERROR',
        });
    }

    console.log('Token:', token); // Log token ra console

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Token is invalid or expired',
                status: 'ERROR',
            });
        }

        console.log('Decoded user info:', user); // Log thông tin người dùng sau khi giải mã ra console

        // Lưu thông tin người dùng vào req.user để sử dụng trong các middleware/controller khác nếu cần
        req.user = user;

        // Tiếp tục xử lý request
        next();
    });
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    authMiddleWareOrder
}