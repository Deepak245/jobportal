import User from "../models/User.js";
import checkPermission from "../utils/checkPermission.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import moment from "moment";
import mongoose from "mongoose";

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job: job });
};

// get details of all the jobs.
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  // const jobs = await Job.find({ createdBy: req.user.userId, status });
  //add stuff based on condition.
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    // queryObject.position = search; this had a glich like if give S or s it dont return proper search
    queryObject.position = { $regex: search, $options: "i" };
  }
  console.log(queryObject);
  // no await added
  let result = Job.find(queryObject);

  // chain sort conditions here we are chaining the sort to result which got retrun from search functionalit remember it
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position"); // ascending sort
  }
  if (sort === "z-a") {
    result = result.sort("-position"); // descending sort
  }
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10; // how many jobs we want back
  const skip = (page - 1) * limit; // how many job we want to leave out of page
  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const noOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ jobs: jobs, totalJobs: totalJobs, numOfPages: noOfPages });
};

//update job
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No Job With Id:${jobId}`);
  }
  console.log(typeof req.user.userId);
  console.log(typeof job.createdBy);
  // check permission
  checkPermission(req.user, job.createdBy);
  const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updateJob: updateJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No Job with id :${jobId}`);
  }
  checkPermission(req.user, job.createdBy);
  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! job got removed" });
  res.send("Jobs Deleted");
};
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  // we dont want status to return as string , we want as an object
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    // here we are sorting based on year so took _id.year
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    // now to display last 6 months
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      // console.log(item);
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({
    defaultStats: defaultStats,
    monthlyApplications: monthlyApplications,
    monthlyappCount: monthlyApplications.length,
  });
};

export { createJob, getAllJobs, updateJob, deleteJob, showStats };
