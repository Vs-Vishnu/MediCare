import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { TimePicker, message } from "antd";
import axios from "axios";

function ApplyDoctor({ userdata, onComplete }) {
  const [formData, setFormData] = useState({
    fullName: userdata?.fullName || "",
    email: userdata?.email || "",
    phone: userdata?.phone || "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
  });
  const [timings, setTimings] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (values) => {
    if (values) {
      setTimings([
        values[0].format("HH:mm"),
        values[1].format("HH:mm")
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timings.length === 0) {
      return message.error("Please specify your consultation hours/timings");
    }
    try {
      const token = localStorage.getItem("token");
      const postData = {
        ...formData,
        timings,
        userId: userdata?._id || JSON.parse(localStorage.getItem("userData"))?._id
      };
      
      const response = await axios.post(
        "http://localhost:8000/api/user/registerdoc",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Application submitted successfully!");
        if (onComplete) onComplete();
      } else {
        message.error(response.data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Apply Doctor error:", error);
      message.error(error.response?.data?.message || "Something went wrong during submission");
    }
  };

  return (
    <Card className="glass-panel p-4 border-0">
      <Card.Body>
        <h2 className="mb-4" style={{ fontWeight: 800 }}>Apply as a Certified Doctor</h2>
        <Form onSubmit={handleSubmit}>
          <h5 className="text-teal mb-3" style={{ color: "var(--neon-teal)", fontWeight: 600 }}>Personal Information</h5>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="email">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="address">
                <Form.Label>Clinic / Hospital Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter complete office location"
                  value={formData.address}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="text-teal mb-3" style={{ color: "var(--neon-teal)", fontWeight: 600 }}>Professional Details</h5>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group controlId="specialization">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  name="specialization"
                  placeholder="e.g. Cardiologist, Dentist"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="experience">
                <Form.Label>Experience (Years)</Form.Label>
                <Form.Control
                  type="text"
                  name="experience"
                  placeholder="e.g. 5"
                  value={formData.experience}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="fees">
                <Form.Label>Consultation Fees ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="fees"
                  placeholder="e.g. 100"
                  value={formData.fees}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="timings">
                <Form.Label className="d-block">Consultation Hours</Form.Label>
                <TimePicker.RangePicker
                  format="HH:mm"
                  onChange={handleTimeChange}
                  style={{ width: "100%", height: "45px" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="btn-premium-accent w-100 py-3 mt-2">
            Submit Application
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ApplyDoctor;
