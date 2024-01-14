import { Router } from "express";
import { createDevice } from "../controllers/device.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT,createDevice);

export default router;
