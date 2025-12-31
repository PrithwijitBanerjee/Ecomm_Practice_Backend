import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async (options = {}) => {
    try {
        await mongoose.connect(config.db.dbUrl + config.db.dbName, options);
        console.log('Connection to DB is successfully established');
        // logger.log('info', 'Connection to DB is successfully established');
        // error in db credentials after successfull connection
        mongoose.connection.on('error', (error) => {
            console.log('Database connection error: ', error);
            // logger.log('error', 'Database connection error:' + error);
        });
    } catch (error) {
        console.log("couldn't connect to db: ", error?.toString());
        // logger.log('error', "couldn't connect to db: " + error?.toString());
        process.exit(1);
    }
};

export default connectDB;