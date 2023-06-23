import CustomAPIError from "../helpers/custom-errors.js";
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.mesage });
  }
  return res.status(500).json({ msg: err.message });
};

export default errorHandlerMiddleware;
