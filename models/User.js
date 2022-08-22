import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minlength: 6,
    select: false, // when we give this property while quering mongodb will not take this field into consideration which make our code secure.
  },
  lastName: {
    type: String,

    default: "Dev",
    maxlength: 20,
    trim: true,
  },
  location: {
    type: String,

    default: "myCity",
    maxlength: 20,
    trim: true,
  },
});

// this will get triggered during two conditions when creating user and updating user
// https://mongoosejs.com/docs/middleware.html
//here we do write bcrypting the user password
// v.v.imp every method will not trigger this hook.
UserSchema.pre("save", async function () {
  console.log(this.password);
  // console.log(this.modifiedPaths())// we get which value is modified.
  // console.log(this.isModified('name'))// returns if name property is modified or not
  if (!this.isModified("password")) return; // which mean if we are not modifing password then we are returning the control so we wrote return only;

  const salt = await bcrypt.genSalt(10);
  // here we have to access as this.password which is coming from auth controller.
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  console.log(this); // here this is nothing but the created user object from the schema.
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
    // expiresIn: "100", // should dieout in 100 milli seconds.
  });
};

UserSchema.methods.comparePasswords = async function (candidatePassword) {
  // console.log(candidatePassword, this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
export default mongoose.model("User", UserSchema);
