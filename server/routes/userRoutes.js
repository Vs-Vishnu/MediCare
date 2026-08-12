const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
} = require("../controllers/userController");

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

// POST user registration
router.post("/register", registerController);

// POST user login
router.post("/login", loginController);

// POST fetch user details (auth protected)
router.post("/getuserdata", authMiddleware, authController);

// POST apply as a doctor
router.post("/registerdoc", authMiddleware, docController);

// GET approved doctors list
router.get("/getalldoctorsu", authMiddleware, getAllDoctorsControllers);

// POST book an appointment (accepts file upload with field name "image")
router.post("/getappointment", authMiddleware, upload.single("image"), appointmentController);

// POST mark notifications as read
router.post("/getallnotification", authMiddleware, getallnotificationController);

// POST clear notifications
router.post("/deleteallnotification", authMiddleware, deleteallnotificationController);

// GET list of appointments made by the user
router.get("/getuserappointments", authMiddleware, getAllUserAppointments);

// GET files uploaded by the user
router.get("/getDocsforuser", authMiddleware, getDocsController);

module.exports = router;
