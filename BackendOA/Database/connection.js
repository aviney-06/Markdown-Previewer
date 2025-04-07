const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://aviney:hello@World06@databaseoa.uvifaxm.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseOA');
        console.log("Database connection established!!");
    } catch (error) {
        console.log("Database connection failed!!");
        process.exit(1);
    }
}

module.exports = connectDB;