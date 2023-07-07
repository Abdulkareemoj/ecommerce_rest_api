// external dependencies
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { StatusCodes } from "http-status-codes";
import MongodbSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import logger from "morgan";

// module dependencies
import connectDb from "../src/api/config/dbconfig.js";
import __404_err_page from "../src/api/middlewares/notFound.js";
import errorHandlerMiddleware from "../src/api/middlewares/errHandler.js";
import { customLogger, errorCustomLogger } from "../src/api/utils/logger.js";
import { consoleLogger } from "../src/api/utils/componentLogger.js";
import { customErrorLogger } from "../src/api/utils/errCustomLogger.js";
//Module Dependencies ends here

// <======= Routes Imports begins here ==========>
import authRoute from "../src/api/routes/authRoute.js";
import productRoute from "../src/api/routes/productRoutes.js";
// <======= Routes Imports ends here ==========>
dotenv.config();

const app = express();

const MongoDBStore = MongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "Sessions-Collection",
  ttl: 60 * 60, // session will expire in 1hr
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
    secret: process.env.SESSION_SECRET_KEY,
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

app.get("/", (req, res, next) => {
  req.session.isAuth = true;
  /*  console.log(req.session);
  console.log(req.session.id); */
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
    await connectDb(process.env.MONGO_URL);
    app.listen(Port, () =>
      consoleLogger.info(`Server listening on http:\//localhost:${Port}`)
    );
  } catch (err) {
    customErrorLogger.error(err.message);
    process.exit(1);
  }
};

startServer();
