import { UnAuthenticatedError } from "../errors/index.js";

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) {
    return;
  }
  throw new UnAuthenticatedError("Not Authorized to use this job");
};

export default checkPermission;
