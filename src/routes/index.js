const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');
const PaymentRouter = require('./PaymentRouter');
const zaloPayRouter = require('./zaloPayRouter');

const routers = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/products', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/zalopay', zaloPayRouter)

}

module.exports = routers