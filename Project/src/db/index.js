import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        
console.log("FINAL URI =", `${process.env.MONGO_URI}/${DB_NAME}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Mongo DB connected || Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
}

export default connectDB;