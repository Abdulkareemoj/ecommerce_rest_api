import { createLogger, transports, format } from "winston";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

const customErrorLogger = createLogger({

  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../../../logs", "customerror.log"),
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.colorize(),
    myFormat
  ),
});

export default customErrorLogger