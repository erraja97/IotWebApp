import { Router } from "express";
import { sendData } from "../controllers/data.controller.js";
import { authenticateDevice } from "../middlewares/device.auth.middleware.js";

const router = Router();

// Route to handle sending data from NodeMCU
router.route("/send/:deviceId").post(authenticateDevice, sendData);

export default router;
