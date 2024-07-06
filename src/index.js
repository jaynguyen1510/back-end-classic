const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

dotenv.config();
// process.env.TOKEN_SECRET;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

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
