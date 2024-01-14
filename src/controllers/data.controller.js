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

export { sendData };
