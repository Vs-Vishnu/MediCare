const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const DocModel = require("../models/DocModel");
const AppointmentModel = require("../models/AppointmentModel");

const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phone, type } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      phone,
      type: type || "user",
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY || "fallback_key",
      { expiresIn: "1d" }
    );

    // Exclude password
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      data: userObject,
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    res.status(500).send({
      success: false,
      message: `Login Controller Error: ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).send({
      success: true,
      data: userObject,
    });
  } catch (error) {
    console.error("Error in authController:", error);
    res.status(500).send({
      success: false,
      message: "Auth error",
      error: error.message,
    });
  }
};

const docController = async (req, res) => {
  try {
    const { fullName, email, timings, phone, address, specialization, experience, fees, userId } = req.body;

    // Save as pending doctor
    const newDoctor = new DocModel({
      userID: userId,
      fullName,
      email,
      timings,
      phone,
      address,
      specialization,
      experience,
      fees,
      status: "pending",
    });

    await newDoctor.save();

    // Send notification to admin users
    const admins = await UserModel.find({ type: "admin" });
    for (let admin of admins) {
      admin.notification.push({
        type: "new-doctor-application",
        message: `${fullName} has applied for a doctor account.`,
        onClickPath: "/admin/doctors",
      });
      await admin.save();
    }

    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.error("Error in docController:", error);
    res.status(500).send({
      success: false,
      message: "Error applying for doctor account",
      error: error.message,
    });
  }
};

const getallnotificationController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Move notifications to seen notifications
    const notifications = user.notification;
    user.seennotification.push(...notifications);
    user.notification = [];

    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: userObject,
    });
  } catch (error) {
    console.error("Error in getallnotificationController:", error);
    res.status(500).send({
      success: false,
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};

const deleteallnotificationController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).send({
      success: true,
      message: "All notifications deleted successfully",
      data: userObject,
    });
  } catch (error) {
    console.error("Error in deleteallnotificationController:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting notifications",
      error: error.message,
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await DocModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Approved doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getAllDoctorsControllers:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching approved doctors",
      error: error.message,
    });
  }
};

const appointmentController = async (req, res) => {
  try {
    let { doctorInfo, userInfo, date, userName } = req.body;

    // Handle strings if JSON strings are sent
    if (typeof doctorInfo === "string") {
      try {
        const parsed = JSON.parse(doctorInfo);
        doctorInfo = parsed._id || parsed;
      } catch (e) {}
    }
    if (typeof userInfo === "string") {
      try {
        const parsed = JSON.parse(userInfo);
        userInfo = parsed._id || parsed;
      } catch (e) {}
    }

    if (!userInfo) {
      userInfo = req.body.userId;
    }

    let documentData = {};
    if (req.file) {
      documentData = {
        path: req.file.path,
        filename: req.file.originalname,
      };
    }

    const newAppointment = new AppointmentModel({
      doctorInfo,
      userInfo,
      date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    // Notify the doctor
    const doctor = await DocModel.findById(doctorInfo);
    if (doctor) {
      const doctorUser = await UserModel.findById(doctor.userID);
      if (doctorUser) {
        doctorUser.notification.push({
          type: "new-appointment-request",
          message: `New appointment requested by ${userName || "a patient"} for ${date}.`,
          onClickPath: "/doctor/appointments",
        });
        await doctorUser.save();
      }
    }

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error in appointmentController:", error);
    res.status(500).send({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({ userInfo: req.body.userId })
      .populate("doctorInfo")
      .populate("userInfo");

    const data = appointments.map((app) => {
      const plainApp = app.toObject();
      plainApp.docName = app.doctorInfo ? app.doctorInfo.fullName : "Unknown Doctor";
      return plainApp;
    });

    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in getAllUserAppointments:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user appointments",
      error: error.message,
    });
  }
};

const getDocsController = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      userInfo: req.body.userId,
      "document.path": { $exists: true, $ne: null },
    });

    const documents = appointments.map((app) => ({
      appointmentId: app._id,
      date: app.date,
      filename: app.document.filename,
      path: app.document.path,
    }));

    res.status(200).send({
      success: true,
      message: "User documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.error("Error in getDocsController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching user documents",
      error: error.message,
    });
  }
};

module.exports = {
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
};
