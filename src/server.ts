// external dependencies
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { StatusCodes } from "http-status-codes";
import MongodbSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import session from "express-session";
import xss from "xss-clean";
import dotenv from "dotenv";
import logger from "morgan";

// Reference path for sessions.
/// <reference path="./api/types/express/custom.d.ts" />

// module dependencies
import connectDb from "../src/api/config/dbconfig";
import __404_err_page from "../src/api/middlewares/notFound";
import errorHandlerMiddleware from "../src/api/middlewares/errHandler";
import { customLogger, errorCustomLogger } from "../src/api/utils/logger";
import { consoleLogger } from "../src/api/utils/componentLogger";
import customErrorLogger from "../src/api/utils/errCustomLogger";
//Module Dependencies ends here

// <======= Routes Imports begins here ==========>
import authRoute from "./api/routes/authRoute";
import productRoute from "./api/routes/productRoutes";
// <======= Routes Imports ends here ==========>
dotenv.config();

const app = express();

const MongoDBStore = MongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL!,
  collection: "Sessions-Collection",
  expires: 60 * 60, // session will expire in 1hr
});
// Middleware functions
app.use(customLogger);
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(
  session({
    resave: false,
    secret: process.env.SESSION_SECRET_KEY!,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: "strict",
      secure: false, // use true if using https
      maxAge: 1000 * 60 * 60, // cookie would expire in 1 hour
    },
  })
);

app.use("/api/v1/mall/user", authRoute);
app.use("/api/v1/mall/products", productRoute);

app.get("/", (req: Request, res: Response) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res
    .status(StatusCodes.PERMANENT_REDIRECT)
    .json({ message: "Welcome to the E-Commerce rest api application." });
});

app.use(errorHandlerMiddleware);
app.use(errorCustomLogger);
app.use("*", __404_err_page);

const Port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URL!);
    app.listen(Port, () =>
      consoleLogger.info(`Server listening on http:\//localhost:${Port}`)
    );
  } catch (err: Error | any) {
    customErrorLogger.error(err.message);
    process.exit(1);
  }
};

startServer();
