import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const portSchema = new mongoose.Schema({
  port: {
    type: String,
    required: true,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    enum: ["INPUT", "OUTPUT", "INPUT_PULLUP"],
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
});

const deviceSchema = new Schema(
  {
    boardId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    serialId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    IOPins: {
      type: Number,
      required: true,
      trim: true,
    },

    ports: [portSchema],

    apikey: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },

    projectId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Device = mongoose.model("Device", deviceSchema);
