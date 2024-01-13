/*
//below function breakdown
const asyncHandler = () => {}; //declare arrow function
const asyncHandler = (func) => {() => {}}; //accept function - now this is higher order function
const asyncHandler = (func) => () => {}; //remove braces
const asyncHandler = (func) => async () => {}; //add async
*/

//second method
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export { asyncHandler };
