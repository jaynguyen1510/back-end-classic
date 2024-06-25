const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
// const bodyParser = require('body-parser');

dotenv.config();
// process.env.TOKEN_SECRET;

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

routes(app);

console.log(process.env.MONGODB_DB, "Hello");
mongoose.connect(`${process.env.MONGODB_DB}`)
    .then(() => {
        console.log("connect Db successfully");
    })
    .catch((err) => {
        console.log(err);
    });




app.listen(port, () => {
    console.log("server is running on port " + port);
});
