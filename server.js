import express from "express";
const app = express();
import dotEnv from "dotenv";
dotEnv.config();

import "express-async-errors";
import morgan from "morgan";
// db and authenticator.
import connectDB from "./db/connnect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobsRouters.js";
//middleware  imports
import notFoundMiddleWare from "./middleWare/not-found.js";
import errorHandlerMiddleWare from "./middleWare/error-handler.js";
import AuthenticateUser from "./middleWare/auth.js";

if (process.env.NODE_ENV != "production") {
  app.use(morgan("dev"));
}
// for parsing incoming data from raw from to json for we should use json parse as below
app.use(express.json());
// notFoundMiddleWare;
// import notFoundMiddleWare from "./middleWare/not-found.js";
app.get("/", (req, res) => {
  throw new Error("error");
  res.send("Welcome!");
});

app.get("/api/v1", (req, res) => {
  // throw new Error("error");
  res.send("this is to Counter issue with proxy.");
});
// right after above to home route we should keep these details

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", AuthenticateUser, jobRouter);
// as all the above are post routes these will be accessed using json formate.
//so we should parse the incoming data for that we should use json parser.
//why at starting as before sending data to routes it should be parsed so we are keeping this at start.

//when we keep app.use it just signals that we are looking for all the http methods like get,post etc...
// thats the reason we should place it after routes or methods if non of them match then go to app.use  middleware in it.
//this will be looking for request which we cannot find the route.

app.use(notFoundMiddleWare);
//what happens if there is any error in the exist inside of routes for that we should define error route.
app.use(errorHandlerMiddleWare);
const port = process.env.port || 5000;

// it should be async as mongoose connect returns promise

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    // we only want to spin up the server only when mongodb connection is successfull.

    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
