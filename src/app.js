import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//below are the middlewares to config express

//express config for json size limit
app.use(express.json({ limit: "16kb" }));

//express config for url params
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//express config for storing assets file
app.use(express.static("public"));

//express config for cookies
app.use(cookieParser());

//routes import
import userRouter from "../src/routes/user.routes.js";
import deviceRouter from "../src/routes/device.routes.js";
import dataRouter from "../src/routes/data.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter); //https://localhost:8000/api/v1/users/register
app.use("/api/v1/devices", deviceRouter); //https://localhost:8000/api/v1/devices/create
app.use("/api/v1/data", dataRouter); //https://localhost:8000/api/v1/data/send/deviceid(param)

export { app };
