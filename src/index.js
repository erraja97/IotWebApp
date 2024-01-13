// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import e from "express";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

//connect to database
connectDB()
  .then(() => {
    //check for error in express listening to db
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB COnnection Failed !!!", error);
  });

/*
//first way to connect to db
import express from "express";
const app = express()(
  //IIFE
  async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      app.on("error", (error) => {
        console.log("ERR: ", error);
        throw error;
      });

      app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw error;
    }
  }
)();
*/
