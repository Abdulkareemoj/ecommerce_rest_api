// Transports are places where you want to save your logs

import expressWinston from "express-winston";

import { consoleLogger } from "./componentLogger";
import customErrorLogger from "./errCustomLogger";

export const customLogger = expressWinston.logger({
  winstonInstance: consoleLogger,
  statusLevels: true,
});

// custom error handler logger
export const errorCustomLogger = expressWinston.errorLogger({
  winstonInstance: customErrorLogger,
});
