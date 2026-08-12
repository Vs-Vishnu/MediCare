import React, { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function DoctorList({ doctor, userdata, onBookingSuccess }) {
  const [show, setShow] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const handleClose = () => {
    setShow(false);
    setDateTime("");
    setDocumentFile(null);
  };
  
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!dateTime) {
      return message.error("Please select a date and time for the appointment");
    }

    try {
      const token = localStorage.getItem("token");
      const postData = new FormData();
      postData.append("doctorInfo", doctor._id);
      postData.append("userInfo", userdata?._id || "");
      postData.append("date", dateTime);
      postData.append("userName", userdata?.fullName || "Patient");
      if (documentFile) {
        postData.append("image", documentFile);
      }

      const response = await axios.post(
        "https://medicare-uz8a.onrender.com/api/user/getappointment",
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        message.success("Appointment request submitted successfully!");
        handleClose();
        if (onBookingSuccess) onBookingSuccess();
      } else {
        message.error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error(error.response?.data?.message || "Something went wrong during booking");
    }
  };

  // Get current date string formatted as YYYY-MM-DDTHH:MM to set min value
  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  return (
    <>
      <Card className="glass-panel h-100 border-0 p-3">
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4 style={{ fontWeight: 700, color: "white", marginBottom: "4px" }}>Dr. {doctor.fullName}</h4>
                <span 
                  className="px-2 py-1 rounded mb-3 d-inline-block" 
                  style={{ background: "rgba(20,184,166,0.15)", color: "var(--neon-teal)", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  {doctor.specialization}
                </span>
              </div>
              <div className="d-flex align-items-center gap-1 text-warning" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                <span>★</span>
                <span>{doctor.rating ? doctor.rating.toFixed(1) : "4.5"}</span>
              </div>
            </div>
            <p className="mb-2" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Experience:</strong> {doctor.experience} Years
            </p>
            <p className="mb-2" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Consultation Fee:</strong> ${doctor.fees}
            </p>
            <p className="mb-2" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Location:</strong> 📍 {doctor.location || "New York"}
            </p>
            <p className="mb-2" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Address:</strong> {doctor.address}
            </p>
            <p className="mb-2" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Timings:</strong> {doctor.timings ? `${doctor.timings[0]} - ${doctor.timings[1]}` : "Not Available"}
            </p>
            <p className="mb-3" style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Contact:</strong> {doctor.phone}
            </p>
          </div>

          <Button onClick={handleShow} className="btn-premium-primary w-100 mt-3">
            Book Now
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered contentClassName="glass-panel text-white border-0 bg-dark">
        <Modal.Header closeButton closeVariant="white" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <Modal.Title style={{ fontWeight: 800 }}>Schedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 text-center">
            <h5 className="mb-1">Dr. {doctor.fullName}</h5>
            <span style={{ color: "var(--neon-teal)", fontWeight: 600 }}>{doctor.specialization}</span>
            <div className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
              Available timings: {doctor.timings ? `${doctor.timings[0]} - ${doctor.timings[1]}` : "N/A"}
            </div>
          </div>

          <Form onSubmit={handleBook}>
            <Form.Group className="mb-3" controlId="appointmentDateTime">
              <Form.Label>Select Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                min={getMinDateTime()}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="documentUpload">
              <Form.Label>Upload Prescription / Report (Optional)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                className="glass-input"
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
                Add diagnostic reports or previous doctor prescriptions.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-light" onClick={handleClose} style={{ borderRadius: "10px" }}>
                Cancel
              </Button>
              <Button type="submit" className="btn-premium-accent">
                Confirm Booking
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DoctorList;
