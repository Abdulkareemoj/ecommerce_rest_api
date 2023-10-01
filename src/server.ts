// external dependencies
import "reflect-metadata";
import "express-async-errors";
import express, { Application, Request, Response } from "express";
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
import rateLimit from "express-rate-limit";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Reference path for sessions.
/// <reference path="./api/types/express/custom.d.ts" />

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

// module dependencies
import connectDb from "../src/api/config/dbconfig";
import __404_err_page from "../src/api/middlewares/notFound";
import errorHandlerMiddleware from "../src/api/middlewares/errHandler";
import { customLogger, errorCustomLogger } from "../src/api/utils/logger";
import { consoleLogger } from "../src/api/utils/componentLogger";
import customErrorLogger from "../src/api/utils/errCustomLogger";

// <======= Routes Imports begins here ==========>
import authRoute from "./api/routes/auth.routes";
import colorRoute from "./api/routes/color.routes";
import productRoute from "./api/routes/product.routes";
import enquiryRoute from "./api/routes/enq.routes";
import blogRoute from "./api/routes/blog.routes";
import blogcategoryRoute from "./api/routes/blogCategory.routes";
import productCategoryRoute from "./api/routes/productCategory.routes";
import brandRoute from "./api/routes/brands.routes";
import couponRoute from "./api/routes/coupon.routes";

dotenv.config();

const app: Application = express();

const MongoDBStore = MongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL!,
  collection: "Sessions-Collection",
  expires: 60 * 60, // session will expire in 1hr
});
// Middleware functions
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(customLogger);
app.use(limiter);
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
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
app.use("/api/v1/mall/blogs", blogRoute);
app.use("/api/v1/mall/brand", brandRoute);
app.use("/api/v1/mall/blogscategory", blogcategoryRoute);
app.use("/api/v1/mall/productscategory", productCategoryRoute);
app.use("/api/v1/mall/coupon", couponRoute);
app.use("/api/v1/mall/colors", colorRoute);
app.use("/api/v1/mall/enquiry", enquiryRoute);

app.get("/", (req: Request, res: Response) => {
  req.session.isAuth = true;
  // console.log(req.session);
  // console.log(req.session.id);
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
