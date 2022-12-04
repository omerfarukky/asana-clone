const httpStatus = require("http-status");
const ApiError = require("../error/apiError");

const idChecker = (field) => (req, res, next) => {
  const idField = field || "id";
  if (!req?.params[idField]?.match(/^[0-9a-fA-F]{24}$/)) {
    next(new ApiError("Lütfen geçerli formatta ID bilgisi giriniz !!!", httpStatus.BAD_REQUEST));
    return;
  }
  next();
};

module.exports = idChecker;
