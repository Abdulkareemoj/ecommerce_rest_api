import { createLogger, transports, format } from "winston";
import MongoDB from "winston-mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    new transports.MongoDB({
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
