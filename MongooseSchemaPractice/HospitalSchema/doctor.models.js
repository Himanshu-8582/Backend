import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({});


export const Doctor = mongoose.model('Doctor', doctorSchema);