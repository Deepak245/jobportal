import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleWare = (err, req, res, next) => {
  //Much of cases what ever the empty values coming from controller can be captured using err.message which is built in js method
  // through that we are keeping err.message with or condition.
  console.log("Error is from ErrorHandler MiddleWare");
  console.log(err);
  let defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  //these are errors they are coming from mongo db. validations we kept
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    //defaultError.msg = err.message; // what if there are many validation errors
    // in that case we have to iterate over the errors and append to msg object
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(","); // convert all obj to array
  }
  // hew we handle error with some code and again we should collect data based on key inside of a object

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // console.log(Object.keys(err.keyValue));
    defaultError.msg = `${Object.keys(err.keyValue)} Field hs to be unique`;
  }
  // res.status(defaultError.statusCode).json({ msg: err });
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleWare;
