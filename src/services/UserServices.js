const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email,
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "email already exists",
                })
            }

            const hashPassword = bcrypt.hashSync(password, 10)

            const createdUser = await User.create({
                name,
                email,
                password: hashPassword,
                phone
            })
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "create user success",
                    data: createdUser
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

const getLoginUser = (checkUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = checkUser
        try {
            const foundUser = await User.findOne({ email: email });
            if (foundUser === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                })
            }

            const comparePassword = bcrypt.compareSync(password, foundUser.password);

            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "The password or user is incorrect",
                })
            }
            const access_token = await generalAccessToken({
                id: foundUser.id,
                isAdmin: foundUser.isAdmin
            });
            const refresh_token = await generalRefreshToken({
                id: foundUser.id,
                isAdmin: foundUser.isAdmin
            });
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundUser = await User.findOne({ _id: id });

            if (foundUser === null) {
                resolve({
                    status: "ok",
                    message: "The user is not defined",
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateUser
            });
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundUser = await User.findOne({
                _id: id
            });
            if (foundUser === null) {
                resolve({
                    status: "ok",
                    message: "The user is not defined",
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETE USER SUCCESS",
            });
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: "OK",
                message: "GET ALL USER SUCCESS",
                data: allUser
            });
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: checkUser
            });
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
    createUser,
    getLoginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser

}