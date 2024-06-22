const createUser = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                name: "Nhật Nam",
                email: "nhocnampro0789@gmail.com",
                password: "123",
                isAdmin: true,
                phone: 1234567890,
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = { createUser }