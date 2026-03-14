const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
            console.log('Spinning up in-memory MongoDB instance for local testing...');
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
