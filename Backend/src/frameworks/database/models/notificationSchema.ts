import mongoose, { Schema, Types } from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: Schema.Types.ObjectId, required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  senderName:{ type:String },
  message: { type: String, required: true },
  rideId:{ type: Types.ObjectId},
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
