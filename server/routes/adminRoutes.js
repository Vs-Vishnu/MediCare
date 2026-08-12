const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
} = require("../controllers/adminController");

const router = express.Router();

// GET all users
router.get("/getallusers", authMiddleware, getAllUsersControllers);

// GET all doctors
router.get("/getalldoctors", authMiddleware, getAllDoctorsControllers);

// POST approve doctor
router.post("/getapprove", authMiddleware, getStatusApproveController);

// POST reject doctor
router.post("/getreject", authMiddleware, getStatusRejectController);

// GET all appointments for admin
router.get("/getallAppointmentsAdmin", authMiddleware, displayAllAppointmentController);

module.exports = router;
