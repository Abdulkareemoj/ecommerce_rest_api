import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const verifyRefToken = (req, res, next) => {
  const refreshToken = req.headers["x-refresh-token"] || req.body.refreshToken;

  if (!refreshToken) return res.status(StatusCodes.UNAUTHORIZED);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid refresh Token" });
  }
};


