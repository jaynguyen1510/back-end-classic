const UserService = require("../services/UserServices")

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const newRes = await UserService.createUser(req.body)
        return res.status(200).json(newRes);
    } catch (e) {
        return res.status(400).json({
            message: e

        })
    }
}
module.exports = {
    createUser
}