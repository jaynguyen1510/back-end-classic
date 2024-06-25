const ProductModel = require('../models/ProductModel');
const bcrypt = require("bcrypt");

const createProducts = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct

        try {
            const checkProduct = await ProductModel.findOne({
                name: name,
            })
            if (checkProduct !== null) {
                resolve({
                    status: "ok",
                    message: "name of products already exists",
                })
            }

            const createdProduct = await ProductModel.create({
                name, image, type, price, countInStock, rating, description
            })
            if (createdProduct) {
                resolve({
                    status: "success",
                    message: "create Product success",
                    data: createdProduct
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}
const updateProducts = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundProduct = await ProductModel.findOne({ _id: id });

            if (foundProduct === null) {
                resolve({
                    status: "ok",
                    message: "The product is not defined",
                })
            }
            const updateProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateProduct
            });
        } catch (e) {
            reject(e)
        }
    })
}
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundProduct = await ProductModel.findOne({
                _id: id
            });
            if (foundProduct === null) {
                resolve({
                    status: "ok",
                    message: "The Product is not defined",
                })
            }
            await ProductModel.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETE PRODUCT SUCCESS",
            });
        } catch (e) {
            reject(e)
        }
    })
}
const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllProducts = await ProductModel.find()
            resolve({
                status: "OK",
                message: "GET ALL PRODUCT SUCCESS",
                data: getAllProducts
            });
        } catch (e) {
            reject(e)
        }
    })
}
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundProduct = await ProductModel.findOne({
                _id: id
            });
            if (foundProduct === null) {
                resolve({
                    status: "ok",
                    message: "The product is not defined",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: foundProduct
            });
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProducts,
    updateProducts,
    getDetailsProduct,
    deleteProduct,
    getAllProducts
}