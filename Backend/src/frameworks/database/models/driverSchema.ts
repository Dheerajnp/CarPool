import { model, Schema, Document } from "mongoose";
import Driver from "../../../entities/interfaces/DriverInterface";

const vehicleSchema = new Schema({
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  rcDocumentUrl: {
    type: String,
  },
  status:{
    type: String,
    enum: ['approved', 'rejected'],
    default: 'pending',
  }
});

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
