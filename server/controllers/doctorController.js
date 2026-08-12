const path = require("path");
const fs = require("fs");
const DocModel = require("../models/DocModel");
const AppointmentModel = require("../models/AppointmentModel");
const UserModel = require("../models/UserModel");

const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await DocModel.findOneAndUpdate(
      { userID: req.body.userId },
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found to update",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in updateDoctorProfileController:", error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error: error.message,
    });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await DocModel.findOne({ userID: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await AppointmentModel.find({ doctorInfo: doctor._id })
      .populate("userInfo")
      .populate("doctorInfo");

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in getAllDoctorAppointmentsController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor appointments",
      error: error.message,
    });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, appointId, status } = req.body;
    const targetId = appointmentId || appointId;

    const appointment = await AppointmentModel.findByIdAndUpdate(
      targetId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    // Send a notification to the user
    const user = await UserModel.findById(appointment.userInfo);
    if (user) {
      user.notification.push({
        type: "appointment-status-updated",
        message: `Your appointment status has been updated to "${status}".`,
        onClickPath: "/userappointments",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error in handleStatusController:", error);
    res.status(500).send({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

const documentDownloadController = async (req, res) => {
  try {
    const { appointId, appointmentId } = req.query;
    const targetId = appointId || appointmentId;

    const appointment = await AppointmentModel.findById(targetId);
    if (!appointment || !appointment.document || !appointment.document.path) {
      return res.status(404).send({
        success: false,
        message: "No document associated with this appointment",
      });
    }

    const filePath = path.resolve(appointment.document.path);
    if (fs.existsSync(filePath)) {
      res.download(filePath, appointment.document.filename || "medical_record");
    } else {
      res.status(404).send({
        success: false,
        message: "File not found on server disk",
      });
    }
  } catch (error) {
    console.error("Error in documentDownloadController:", error);
    res.status(500).send({
      success: false,
      message: "Error downloading document",
      error: error.message,
    });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};
