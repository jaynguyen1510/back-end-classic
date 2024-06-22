const UserService = require("../services/UserServices")

const createUser = async (req, res) => {
    try {
        console.log(req.body);
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
module.exports = {
    createUser
}