import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 5000;
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`App is listening at PORT : ${port}`)
        })
    })
    .catch((error) => {
        console.log('MongoDB Connection failes !!!', error);
})




// We can also connect db as this:--

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from 'express';
// const app = express();
// ; (async() => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         app.on('error', (error) => {
//             console.log("ERRR: ", error);
//             throw error;
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port : ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log('Error:', error);
//         throw error;
//     }
// })()