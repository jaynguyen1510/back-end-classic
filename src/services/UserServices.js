const User = require("../models/UserModel");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email,
            })
            if (checkUser !== null) {
                resolve({
                    status: "ok",
                    message: "email already exists",
                })
            }
            const createdUser = await User.create({
                name,
                email,
                password,
                confirmPassword,
                phone
            })
            if (createdUser) {
                resolve({
                    status: "success",
                    message: "create user success",
                    data: createdUser
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser
}