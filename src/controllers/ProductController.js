const ProductService = require("../services/ProductService")

const createProducts = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body

        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'error',
                message: "The input is required"
            })
        }
        const response = await ProductService.createProducts(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const updateProducts = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'error',
                message: "The productId is required"
            })
        }
        const response = await ProductService.updateProducts(productId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {

    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'error',
                message: "The productId is required"
            })
        }
        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id
        console.log("check", productId);
        if (!productId) {
            return res.status(200).json({
                status: 'error',
                message: "The productId is required"
            })
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { limit, page } = req.query

        const response = await ProductService.getAllProducts(Number(limit), Number(page));
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

module.exports = {
    createProducts,
    updateProducts,
    getDetailsProduct,
    deleteProduct,
    getAllProducts
}