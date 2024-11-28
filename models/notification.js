import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    notifications: {
      message: {
        type: [String],
        required: true,
      },
      times: {
        type: [String],
        required: true, 
      },
      read: {
        type: [Boolean], // เพิ่มฟิลด์เก็บสถานะการอ่าน
        default: [],
      }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
