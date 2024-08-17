const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');

const routers = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/products', ProductRouter)
    app.use('/api/order', OrderRouter)
}

module.exports = routers