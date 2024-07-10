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
                    status: "OK",
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
                    status: "OK",
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
                    status: "OK",
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

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundProduct = await ProductModel.findOne({
                _id: id
            });
            if (foundProduct === null) {
                resolve({
                    status: "OK",
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
const getAllProducts = async (limit = 8, page = 0, sort, filter) => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalProducts = await ProductModel.countDocuments();
            if (filter) {
                const label = filter[0]
                const allObjectFilter = await ProductModel.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit);

                resolve({
                    status: "OK",
                    message: "GET ALL PRODUCT SUCCESS",
                    data: allObjectFilter,
                    total: totalProducts,
                    pageCurrent: Number(page + 1),
                    totalPages: Math.ceil(totalProducts / limit),
                });
            }
            if (sort) {
                const objects = {}
                objects[sort[1]] = sort[0]
                const allProductSort = await ProductModel.find().limit(limit).skip(page * limit).sort(objects);
                resolve({
                    status: "OK",
                    message: "GET ALL PRODUCT SUCCESS",
                    data: allProductSort,
                    total: totalProducts,
                    pageCurrent: Number(page + 1),
                    totalPages: Math.ceil(totalProducts / limit),
                });
            }
            const products = await ProductModel.find().limit(limit).skip(page * limit)
            resolve({
                status: "OK",
                message: "GET ALL PRODUCT SUCCESS",
                data: products,
                total: totalProducts,
                pageCurrent: Number(page + 1),
                totalPages: Math.ceil(totalProducts / limit),
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "GET ALL PRODUCT FAILED",
                error: e.message
            });
        }
    })
};

module.exports = {
    createProducts,
    updateProducts,
    getDetailsProduct,
    deleteProduct,
    getAllProducts
}