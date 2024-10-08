// const asyncHandler = (requestHandler) => {

//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   }
// }

const asyncHandler = (requestHandler) => async (req, res, next) => {
  
  try {
    return await requestHandler(req, res, next);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export { asyncHandler };
