
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {acceptApplication,getApplicationsForJob,applyToJob,getMyApplications}  = require("../controllers/applicationController");


router.post("/:jobId",auth,roleCheck("freelancer"),applyToJob );
router.get("/job/:jobId",auth,roleCheck("client"),getApplicationsForJob);
router.put("/:id/accept",auth,roleCheck("client"),acceptApplication);
router.get("/my-applications",auth,roleCheck("freelancer"),getMyApplications) ;


module.exports = router ;