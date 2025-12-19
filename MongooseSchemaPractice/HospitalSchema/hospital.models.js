import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({});


export const Hospital = mongoose.model('Hospital', hospitalSchema);