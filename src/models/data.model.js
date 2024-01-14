import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    // Common fields shared by all devices
    boardId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    serialId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    apikey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    dataParams: {
      type: String, // format --> param1:param2:param3 etc.
      required: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["SEND_DATA", "RECEIVE_DATA", "SEND_AND_RECEIVE_DATA"],
    },
    // Flexible field for device-specific data
    deviceSpecificData: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const Data = mongoose.model("Data", dataSchema);
