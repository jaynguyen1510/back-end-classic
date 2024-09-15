const UserService = require("../services/UserServices")
const JwtService = require("../services/JwService")


const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckMail = reg.test(email)

        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: "The input is required"
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'ERR',
                message: "Input is email"
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
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
        const { email, password } = req.body
        const reg = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckMail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: "The input is required"
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'ERR',
                message: "Input is email"
            })
        }
        const response = await UserService.getLoginUser(req.body);
        const { refresh_token, ...newRespond } = response
        // console.log("response", response);
        const refreshToken = refresh_token; // Lưu giá trị refresh_token vào biến refreshToken
        console.log("refreshToken", refreshToken); // Log giá trị của refreshToken
        res.cookie("refresh_token", refresh_token, {
            // expires: new Date(Date.now() + 604800000), // 1 week
            HttpOnly: true,
            Secure: false,
            samesite: "strict"
        });

        return res.status(200).json({ ...newRespond, refresh_token });
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
                status: 'ERR',
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
                status: 'ERR',
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
const deleteManyUser = async (req, res) => {

    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: "The userId is required"
            })
        }
        const response = await UserService.deleteUserMany(ids);
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
            return res.status(400).json({
                status: 'ERR',
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
        const token = req.headers.token.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: "The token is required"
            });
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            status: 'ERR',
            message: e.message || 'Something went wrong',
        });
    }
}
const logOutUser = async (req, res) => {
    try {
        res.clearCookie("refresh_token")
        return res.status(400).json({
            status: 'OK',
            message: "Logout was successful"
        });
    }
    catch (e) {
        return res.status(400).json({
            status: 'ERR',
            message: e.message || 'Something went wrong',
        });
    }
}

module.exports = {
    createUser,
    loginUser,
    logOutUser,
    updateUser,
    deleteUser,
    deleteManyUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}