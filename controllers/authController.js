import User from "../models/User.js";
import { RESET_CONTENT, StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

// its always suggestable to use try catch with async await. but there are
//other ways to acheive these operations as well.
// one of the way to acheive fast result is by using express-async-await package
// we can remove this try catch blocks complete in async await
// const register = async (req, res, next) => {
//   try {
//     // here we will create an user as its register function.
//     //req.body contains details related to userCreation. and should be defined as per userSchema.
//     const user = await User.create(req.body);
//     res.status(201).json({ user: user });
//   } catch (error) {
//     // res.status(500).json({ msg: error });
//     // as per express docs we can eliminate the above step my introducing next to function body.
//     // so that the error will be thrown to error handling middleware.
//     next(error);
//   }
//   // res.send("register User");
// };

// above code demonistrated with async await.
// one of the way to acheive fast result is by using express-async-await package
// we can remove this try catch blocks complete in async await
const register = async (req, res) => {
  // so with express async error no need to use try catch blocks.
  // but still we get our data in errors that are coming in async errors.
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // throw new Error("Please provide either name or Email or Password");
    throw new BadRequestError(
      "Please provide either name or Email or Password"
    );
  }
  const userAlreadyExits = await User.findOne({ email: email });
  if (userAlreadyExits) {
    throw new BadRequestError("Email Already in Exist in userDB");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  //here for security sake we are sending specific values to frontend from user object.
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token: token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please Provide all Values");
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("InValid Credentials");
  }
  // here we get error for sure even though the user exist. reason is we kept select false in user model of password.
  //due to that setting password will not get returned from the user object and bcrypt will return false and output would come as invalid response.
  // this error would come due to fact that we are using findone and it should not be used when we had select is false in model.
  //for that reason we should override the password with object.select('+password')
  const isPasswordCorrect = await user.comparePasswords(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  // the user contains password it should not be exposed to outer world so we keep that password as undefined
  user.password = undefined;
  // console.log(user);
  res
    .status(StatusCodes.OK)
    .json({ user: user, token: token, location: user.location });
  // res.send("Login User");
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all Values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  await user.save(); // not every method will trigger this hook.
  // instead of that we can use findoneandupdate which would solve lot of problems.
  //as we used user.save so wise we got error Error: Illegal arguments: undefined, string from bcript of save method in user model.
  //Reason:- In User Model we kept password to false, now when we used user.save method, by default UserSchema.pre("save") will get triggered which need password.
  //where as the the req in above there comes confilt and we get error illegal argument error.
  // so to solve this problem we should go and get the value which is modified based on that we will keep validation in userschema.pre.
  /// so to get modified value we use this.modifiedPaths method to get the vlaues.
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: user,
    name: name,
    lastName: lastName,
    location: location,
    token: token,
  });
  // res.send("User Updated");
};

export { register, login, updateUser };
