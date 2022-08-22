import express from "express";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobsController.js";
import AuthenticateUser from "../middleWare/auth.js";

const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
//always keep statas a head of :id as stats is string and :id is value coming frommongo db
// once if data comes in the same id data first goes to status route so wrong data would get passed out.
router.route("/stats").get(showStats);
router.route("/:id").delete(deleteJob).patch(updateJob);
export default router;
