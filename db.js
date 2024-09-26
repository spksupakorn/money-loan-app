const mongoose = require('mongoose');

require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);

        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;

