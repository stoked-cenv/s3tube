const asyncHandler = require("../middlewares/asyncHandler");

exports.healthCheck = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
