import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custome-api.js";

// really cool feature is we only have to setup this once. and we can use anywhere.
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
