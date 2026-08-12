const UserModel = require("../models/UserModel");
const DocModel = require("../models/DocModel");
const AppointmentModel = require("../models/AppointmentModel");

const getAllUsersControllers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data list fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in getAllUsersControllers:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error: error.message,
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await DocModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getAllDoctorsControllers:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error: error.message,
    });
  }
};

const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, userid } = req.body;
    
    // Update doctor's status
    const doctor = await DocModel.findByIdAndUpdate(
      doctorId,
      { status: "approved" },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Find and update the user
    const targetUserId = userid || doctor.userID;
    const user = await UserModel.findById(targetUserId);
    if (user) {
      user.isdoctor = true;
      user.notification.push({
        type: "doctor-application-approved",
        message: "Congratulations! Your doctor application has been approved.",
        onClickPath: "/doctor-dashboard",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Doctor status updated to approved successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getStatusApproveController:", error);
    res.status(500).send({
      success: false,
      message: "Error in approving doctor status",
      error: error.message,
    });
  }
};

const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, userid } = req.body;

    const doctor = await DocModel.findByIdAndUpdate(
      doctorId,
      { status: "rejected" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const targetUserId = userid || doctor.userID;
    const user = await UserModel.findById(targetUserId);
    if (user) {
      user.notification.push({
        type: "doctor-application-rejected",
        message: "Your doctor application request has been rejected.",
        onClickPath: "/doctor-dashboard",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Doctor status updated to rejected successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getStatusRejectController:", error);
    res.status(500).send({
      success: false,
      message: "Error in rejecting doctor status",
      error: error.message,
    });
  }
};

const displayAllAppointmentController = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({})
      .populate("doctorInfo")
      .populate("userInfo");
      
    res.status(200).send({
      success: true,
      message: "All appointments fetched successfully for admin",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in displayAllAppointmentController:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching all appointments for admin",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
};
