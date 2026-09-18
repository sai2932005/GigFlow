
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const {createJob,getAllJobs,getjobById,completeJob, myJobs} = require("../controllers/jobController");


router.post("/",auth,roleCheck("client"),createJob);
router.get("/my-jobs" ,auth,roleCheck("client"), myJobs);
router.get("/",getAllJobs);
router.get("/:id",getjobById);
router.put("/:id/complete",auth,roleCheck("client"),completeJob);

module.exports = router ;