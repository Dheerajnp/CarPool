import { model, Schema, Document } from "mongoose";
import Driver from "../../../entities/interfaces/DriverInterface";

import path from "path";

const defaultProfilePicPath = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1727417465~exp=1727418065~hmac=f5612e9180ed0edf5119919a1c14bb10eafca2b4275724390805024c73119b51";

const  vehicleSchema = new Schema({
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  rcDocumentUrl: {
    type: String,
  },
  number:{
    type: String,
  },
  status:{
    type: String,
    enum: ['approved', 'rejected','pending'],
    default: 'pending',
  }
});

export const vehicleModel = model("Vehicle", vehicleSchema);

const driverSchema = new Schema<Driver>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: String,
    default: defaultProfilePicPath,
  },
  role: {
    type: String,
    enum: ["host", "rider"],
  },
  otp: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  licenseStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
  },
  licenseBackUrl: {
    type: String,
  },
  licenseFrontUrl: {
    type: String,
  },
  vehicles: {
    type: [vehicleSchema],
    default: [],
  },
});

const driverModel = model<Driver>("Driver", driverSchema);
export default driverModel;
