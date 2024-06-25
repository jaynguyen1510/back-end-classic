const UserService = require("../services/UserServices")
const JwtService = require("../services/JwService")


const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckMail = reg.test(email)

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'error',
                message: "The input is required"
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'error',
                message: "Input is email"
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'error',
                message: 'Passwords do not match'
            })
        }
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {

    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckMail = reg.test(email)

        if (!name || !email || !password || !phone) {
            return res.status(200).json({
                status: 'error',
                message: "The input is required"
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'error',
                message: "Input is email"
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'error',
                message: 'Passwords do not match'
            })
        }
        const response = await UserService.getLoginUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {

    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'error',
                message: "The userId is required"
            })
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {

    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'error',
                message: "The userId is required"
            })
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {

    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'error',
                message: "The userId is required"
            })
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {

    try {
        const token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'error',
                message: "The token is required"
            })
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}