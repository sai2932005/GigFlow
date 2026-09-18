const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {updateUserProfile,getStats} = require("../controllers/userController");


router.put("/profile" ,auth, updateUserProfile);
router.get("/stats", auth, getStats);

module.exports = router ;
