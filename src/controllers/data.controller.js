import { Data } from "../models/data.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller to handle sending data from NodeMCU
const sendData = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const { boardId, serialId, apikey, dataParams, action, deviceSpecificData } =
    req.body;

  //check for apikey
  const dbApiKey = req.device?.apikey;

  if (apikey !== dbApiKey) {
    throw new ApiError(500, "Invalid API Key");
  }

  try {
    // Parse dataParams string into an array of parameter names
    const parameterNames = dataParams.split(":");

    // Extract device-specific data based on the provided parameter names
    const extractedData = {};
    parameterNames.forEach((param) => {
      extractedData[param] = deviceSpecificData[param];
    });

    // Create a new Data document
    const newData = new Data({
      deviceId,
      boardId,
      serialId,
      apikey,
      dataParams,
      action,
      deviceSpecificData: extractedData,
    });

    // Save the new Data document
    const savedData = await newData.save();

    if (!savedData) {
      throw new ApiError(500, "Failed to save data from device to DB");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedData,
          "Data sent from device saved successfully"
        )
      );
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Handle the error and send a meaningful response
    throw new ApiError(
      500,
      "Internal Server error, data sent from device not saved"
    );
  }
});

//control port of device
const controlData = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  try {
    const {
      boardId,
      serialId,
      apikey,
      dataParams,
      action,
      deviceSpecificData,
    } = req.body;

    // Check if the provided action is RECEIVE_DATA
    if (action !== "RECEIVE_DATA") {
      return res
        .status(400)
        .json({ message: "Invalid action for controlData" });
    }

    // Parse dataParams string into an array of parameter names
    const parameterNames = dataParams.split(":");

    // Extract device-specific data based on the provided parameter names
    const extractedData = {};
    parameterNames.forEach((param) => {
      extractedData[param] = deviceSpecificData[param];
    });

    // Create a new Data document for controlling data
    const newData = new Data({
      deviceId,
      boardId,
      serialId,
      apikey,
      dataParams,
      action,
      deviceSpecificData: extractedData,
    });

    // Save the new Data document
    const savedData = await newData.save();

    if (!savedData) {
      throw new ApiError(500, "Failed to save control data to DB");
    }

    // You can add logic here to control NodeMCU ports based on the received data

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedData,
          "Control data received and saved successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//controller to handle receiving data
const getLatestReceiveData = asyncHandler(async (req, res) => {
  const { deviceId, apikey } = req.params;
  try {
    // Find the latest entry with action RECEIVE_DATA that matches deviceId and apikey
    const latestData = await Data.findOne({
      action: "RECEIVE_DATA",
      deviceId,
      apikey,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No matching data with RECEIVE_DATA action found" });
    }

    const responseFormat = {
      deviceId: latestData.deviceId,
      boardId: latestData.boardId,
      serialId: latestData.serialId,
      apikey: latestData.apikey,
      dataParams: latestData.dataParams,
      action: latestData.action,
      deviceSpecificData: latestData.deviceSpecificData,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseFormat,
          "Latest RECEIVE_DATA entry fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { sendData, controlData, getLatestReceiveData };
