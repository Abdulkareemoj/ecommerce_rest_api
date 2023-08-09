import { createLogger, transports, format } from "winston";
import { MongoDB } from "winston-mongodb";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

export const consoleLogger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "warn",
      filename: path.join(__dirname, "../../../logs", "logswarnings.log"),
    }),
    new transports.File({
      level: "error",
      filename: path.join(__dirname, "../../../logs", "logsErrors.log"),
    }),
    new transports.File({
      level: "info",
      filename: path.join(__dirname, "../../../logs", "infoLogs.log"),
    }),
    new MongoDB({
      // saving logs to mongodb
      db: process.env.MONGO_URL!,
      options: {
        useUnifiedTopology: true,
      },
      collection: "Server Logs",
      format: format.combine(
        format.timestamp(),
        // convert logs to a json format for mongodb
        format.json()
      ),
    }),
  ],
  format: format.combine(
    format.json(),
    format.colorize(),
    format.timestamp(),
    format.prettyPrint(),
    format.metadata()
  ),
});
