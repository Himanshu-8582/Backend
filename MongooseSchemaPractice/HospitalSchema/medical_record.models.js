import mongoose from "mongoose";

const medical_record_Schema = new mongoose.Schema({});


export const Medical_record = mongoose.model('Medical_record', medical_record_Schema);