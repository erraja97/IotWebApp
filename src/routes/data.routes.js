import { Router } from "express";
import {
  sendData,
  getLatestReceiveData,
  controlData,
} from "../controllers/data.controller.js";
import { authenticateDevice } from "../middlewares/device.auth.middleware.js";

const router = Router();

// Route to handle sending data from NodeMCU
router.route("/send/:deviceId").post(authenticateDevice, sendData);
router
  .route("/receive/:deviceId/:apikey")
  .get(authenticateDevice, getLatestReceiveData);

router.route("/control/:deviceId").post(authenticateDevice, controlData);

export default router;
