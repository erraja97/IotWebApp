import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Device } from "../models/device.model.js";

//create a new device

const createDevice = asyncHandler(async (req, res) => {
  //get device details from frontend
  const { boardId, serialId, name, IOPins, ports, apikey, projectId } =
    req.body;
  const userId = req.user._id;

  //validation
  if (
    [boardId, serialId, name, apikey, projectId].some(
      (field) => field?.trim() === ""
    ) ||
    ports?.length === 0
  ) {
    throw new ApiError(400, "All fields are Required");
  }

  //check if device already exist
  const existedBoard = await Device.findOne({
    $or: [{ boardId }, { serialId }],
  });

  if (existedBoard) {
    throw new ApiError(409, "Device already exist");
  }

  //create device and store in db
  const device = await Device.create({
    boardId,
    serialId,
    name,
    IOPins,
    ports,
    apikey,
    userId: userId,
    projectId,
  });

  //check for device creation
  if (!device) {
    throw new ApiError(500, "Something went wrong while creating new device");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, device, "Device created Successfully"));
});

export { createDevice };
