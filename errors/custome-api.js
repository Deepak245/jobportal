//custom errormessage, when we extend class we should import super in constructor
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    // here we are adding the statuscode of the error property from the error-handler function.
  }
}

export default CustomAPIError;
