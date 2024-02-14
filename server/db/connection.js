const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_KEY;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to db');
}).catch((err) => {
    console.log(err.message);
})