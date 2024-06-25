const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const authMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'error',
                message: 'Token is not valid'
            })
        }
        const { payload } = user
        if (payload?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Token is not valid'
            })
        }
    })
}

const authUserMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'error',
                message: 'Token is not valid'
            })
        }
        const { payload } = user
        if (payload?.isAdmin || payload?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Token is not valid'
            })
        }
    })
}
module.exports = {
    authMiddleWare,
    authUserMiddleWare
}