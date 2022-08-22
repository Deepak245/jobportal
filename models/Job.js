import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please Provide Company"],

      maxlength: 50,
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please Provide Position"],

      maxlength: 100,
      trim: true,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",

      maxlength: 20,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",

      maxlength: 20,
      trim: true,
    },
    jobLocation: {
      type: String,
      required: true,
      default: "my city",

      maxlength: 20,
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide User"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
