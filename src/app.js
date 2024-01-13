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

export { app };
