const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Likhith:ZOW6ucvaZkZ0mxig@namastenode.1ybci.mongodb.net/devTinder"
    );
};

module.exports = connectDB;



