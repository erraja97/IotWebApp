import { Device } from "../models/device.model.js";

export const authenticateDevice = async (req, res, next) => {
  const { deviceId } = req.params;

  try {
    // Check if the device exists in the database
    const device = await Device.findById(deviceId);

    if (!device) {
      // Device not found, return 404 response
      return res.status(404).json({ message: "Device not found" });
    }

    // Attach device details to the request object for further processing
    req.device = device;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
