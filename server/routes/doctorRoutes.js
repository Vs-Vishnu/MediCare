const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
} = require("../controllers/doctorController");

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST update doctor profile
router.post("/updateprofile", authMiddleware, updateDoctorProfileController);

// GET all appointments for a specific doctor
router.get("/getdoctorappointments", authMiddleware, getAllDoctorAppointmentsController);

// POST update status of an appointment (approve/reject)
router.post("/handlestatus", authMiddleware, handleStatusController);

// GET download a specific patient document
router.get("/getdocumentdownload", authMiddleware, documentDownloadController);

module.exports = router;
