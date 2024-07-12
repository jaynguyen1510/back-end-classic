const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const authMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(404).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Token is not found'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                status: 'ERR',
                message: 'Token is NOT valid'
            })
        }
    })
}

const authUserMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(404).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }

    const userId = req.params.id
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Token is not found'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                status: 'ERR',
                message: 'Token is not valid'
            })
        }
    })
}
module.exports = {
    authMiddleWare,
    authUserMiddleWare
}