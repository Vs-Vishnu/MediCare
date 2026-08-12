import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form, Card, Alert, Spinner } from "react-bootstrap";
import { TimePicker, message } from "antd";
import axios from "axios";

// Import Components
import DoctorList from "../components/DoctorList";
import ApplyDoctor from "../components/ApplyDoctor";
import Notification from "../components/Notification";

function UserHome() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [docAppointments, setDocAppointments] = useState([]);
  
  // Doctor Profile Edit state
  const [docProfile, setDocProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    timings: []
  });
  
  const [loading, setLoading] = useState(true);

  // Sync user data & set default views
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const localData = JSON.parse(localStorage.getItem("userData") || "{}");
      
      const response = await axios.post(
        "http://localhost:8000/api/user/getuserdata",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        setUserdata(response.data.data);
        
        // If doctor, set default tab to doctor appointments
        if (response.data.data.isdoctor) {
          setActiveMenuItem("doc-appointments");
          fetchDocAppointments();
          fetchDocProfileData(response.data.data._id);
        } else {
          setActiveMenuItem("home");
          fetchApprovedDoctors();
          fetchPatientAppointments();
        }
      }
    } catch (error) {
      console.error("Fetch user info error:", error);
      message.error("Session expired. Please log in again.");
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Patients: Fetch Approved Doctors
  const fetchApprovedDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/user/getalldoctorsu", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDoctorsList(response.data.data);
      }
    } catch (error) {
      console.error("Fetch approved doctors error:", error);
    }
  };

  // Patients: Fetch bookings history
  const fetchPatientAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/user/getuserappointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAppointmentsList(response.data.data);
      }
    } catch (error) {
      console.error("Fetch patient appointments error:", error);
    }
  };

  // Doctors: Fetch client bookings
  const fetchDocAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/doctor/getdoctorappointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDocAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Fetch doctor appointments error:", error);
    }
  };

  // Doctors: Load profile data
  const fetchDocProfileData = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      // Find doctor profile associated with userID
      const response = await axios.get("http://localhost:8000/api/admin/getalldoctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const foundDoc = response.data.data.find(d => d.userID === userId);
        if (foundDoc) {
          setDocProfile(foundDoc);
        }
      }
    } catch (error) {
      console.error("Fetch doc profile error:", error);
    }
  };

  // Doctors: Handle Accept / Reject appointment request
  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/doctor/handlestatus",
        { appointmentId, status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        message.success(`Appointment marked as ${status}`);
        fetchDocAppointments();
      }
    } catch (error) {
      console.error("Status update error:", error);
      message.error("Failed to update status");
    }
  };

  // Doctors: Download uploaded patient document
  const handleDownload = (appointId) => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:8000/api/doctor/getdocumentdownload?appointId=${appointId}&Authorization=Bearer ${token}`);
  };

  // Doctors: Edit profile handler
  const handleProfileChange = (e) => {
    setDocProfile({
      ...docProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/doctor/updateprofile",
        docProfile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        message.success("Doctor profile details updated successfully!");
        fetchUserInfo();
      }
    } catch (error) {
      console.error("Profile submit error:", error);
      message.error("Failed to update doctor profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner animation="border" variant="teal" />
      </div>
    );
  }

  if (!userdata) return null;

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-logo">MediCareBook</div>
        <div className="sidebar-menu">
          {!userdata.isdoctor ? (
            <>
              <div 
                className={`sidebar-item ${activeMenuItem === "home" ? "active" : ""}`}
                onClick={() => { setActiveMenuItem("home"); fetchApprovedDoctors(); }}
              >
                Browse Doctors
              </div>
              <div 
                className={`sidebar-item ${activeMenuItem === "appointments" ? "active" : ""}`}
                onClick={() => { setActiveMenuItem("appointments"); fetchPatientAppointments(); }}
              >
                My Bookings
              </div>
              <div 
                className={`sidebar-item ${activeMenuItem === "apply" ? "active" : ""}`}
                onClick={() => setActiveMenuItem("apply")}
              >
                Apply as Doctor
              </div>
            </>
          ) : (
            <>
              <div 
                className={`sidebar-item ${activeMenuItem === "doc-appointments" ? "active" : ""}`}
                onClick={() => { setActiveMenuItem("doc-appointments"); fetchDocAppointments(); }}
              >
                Patient Bookings
              </div>
              <div 
                className={`sidebar-item ${activeMenuItem === "doc-profile" ? "active" : ""}`}
                onClick={() => { setActiveMenuItem("doc-profile"); fetchDocProfileData(userdata._id); }}
              >
                My Profile
              </div>
            </>
          )}

          <div 
            className={`sidebar-item ${activeMenuItem === "notifications" ? "active" : ""}`}
            onClick={() => setActiveMenuItem("notifications")}
          >
            Notifications Center
          </div>

          <div className="sidebar-item mt-auto text-danger" onClick={handleLogout}>
            Logout Session
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header-panel">
          <div className="header-user">
            <h4>
              Welcome, {userdata.isdoctor ? `Dr. ${userdata.fullName}` : userdata.fullName}
            </h4>
            {userdata.isdoctor && (
              <span className="status-badge status-approved">Verified Practitioner</span>
            )}
          </div>
          <div className="notification-badge" onClick={() => setActiveMenuItem("notifications")}>
            <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>🔔</span>
            {userdata.notification?.length > 0 && (
              <span className="badge-count">{userdata.notification.length}</span>
            )}
          </div>
        </div>

        {/* Dashboard Content Switching */}
        <Container fluid className="p-0">
          
          {/* PATIENT: Doctors List */}
          {activeMenuItem === "home" && !userdata.isdoctor && (
            <div>
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Available Specialists</h2>
              {doctorsList.length === 0 ? (
                <Alert variant="info" className="bg-transparent border-info text-white">
                  No verified doctors are currently online. Please check back later.
                </Alert>
              ) : (
                <Row className="g-4">
                  {doctorsList.map((doc) => (
                    <Col key={doc._id} md={6} lg={4}>
                      <DoctorList doctor={doc} userdata={userdata} onBookingSuccess={fetchPatientAppointments} />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}

          {/* PATIENT: Bookings History */}
          {activeMenuItem === "appointments" && !userdata.isdoctor && (
            <div className="glass-panel p-4 border-0">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Booking History</h2>
              {appointmentsList.length === 0 ? (
                <Alert variant="info" className="bg-transparent border-info text-white">
                  You haven't scheduled any doctor consultations yet.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table className="premium-table mb-0">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Specialization</th>
                        <th>Scheduled Date</th>
                        <th>Attached File</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentsList.map((app) => (
                        <tr key={app._id}>
                          <td>Dr. {app.docName}</td>
                          <td>{app.doctorInfo ? app.doctorInfo.specialization : "General Practitioner"}</td>
                          <td>{app.date ? app.date.replace("T", " ") : "N/A"}</td>
                          <td>
                            {app.document && app.document.path ? (
                              <a 
                                href={`http://localhost:8000/uploads/${app.document.path.split(/[/\\]/).pop()}`} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ color: "var(--neon-teal)", textDecoration: "none", fontWeight: 500 }}
                              >
                                {app.document.filename || "View Record"}
                              </a>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge status-${app.status}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* PATIENT: Apply Doctor Form */}
          {activeMenuItem === "apply" && !userdata.isdoctor && (
            <ApplyDoctor userdata={userdata} onComplete={fetchUserInfo} />
          )}

          {/* DOCTOR: View Incoming Patient Bookings */}
          {activeMenuItem === "doc-appointments" && userdata.isdoctor && (
            <div className="glass-panel p-4 border-0">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Consultation Schedule</h2>
              {docAppointments.length === 0 ? (
                <Alert variant="info" className="bg-transparent border-info text-white">
                  No patient requests scheduled.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table className="premium-table mb-0">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Contact phone</th>
                        <th>Booking Date</th>
                        <th>Patient Document</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docAppointments.map((app) => (
                        <tr key={app._id}>
                          <td>{app.userInfo ? app.userInfo.fullName : "Unknown Patient"}</td>
                          <td>{app.userInfo ? app.userInfo.phone : "N/A"}</td>
                          <td>{app.date ? app.date.replace("T", " ") : "N/A"}</td>
                          <td>
                            {app.document && app.document.path ? (
                              <Button 
                                variant="link" 
                                onClick={() => handleDownload(app._id)}
                                style={{ color: "var(--neon-teal)", padding: 0, textDecoration: "none", fontWeight: 500 }}
                              >
                                {app.document.filename || "Download"}
                              </Button>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge status-${app.status}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            {app.status === "pending" && (
                              <div className="d-flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="btn-premium-primary"
                                  onClick={() => handleAppointmentStatus(app._id, "approved")}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger" 
                                  style={{ borderRadius: "8px" }}
                                  onClick={() => handleAppointmentStatus(app._id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            {app.status === "approved" && (
                              <Button 
                                size="sm" 
                                className="btn-premium-accent"
                                onClick={() => handleAppointmentStatus(app._id, "completed")}
                              >
                                Mark Completed
                              </Button>
                            )}
                            {app.status === "completed" && (
                              <span className="text-muted">No Actions</span>
                            )}
                            {app.status === "rejected" && (
                              <span className="text-muted">Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* DOCTOR: Update Doctor profile settings */}
          {activeMenuItem === "doc-profile" && userdata.isdoctor && (
            <Card className="glass-panel p-4 border-0">
              <Card.Body>
                <h2 className="mb-4" style={{ fontWeight: 800 }}>Edit Practitioner Profile</h2>
                <Form onSubmit={handleProfileSubmit}>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group controlId="editFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={docProfile.fullName}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="editEmail">
                        <Form.Label>Public Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={docProfile.email}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="editPhone">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={docProfile.phone}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group controlId="editAddress">
                        <Form.Label>Clinic Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={docProfile.address}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group controlId="editSpec">
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control
                          type="text"
                          name="specialization"
                          value={docProfile.specialization}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="editExp">
                        <Form.Label>Experience (Years)</Form.Label>
                        <Form.Control
                          type="text"
                          name="experience"
                          value={docProfile.experience}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="editFees">
                        <Form.Label>Consultation Fee ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="fees"
                          value={docProfile.fees}
                          onChange={handleProfileChange}
                          className="glass-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" className="btn-premium-accent w-100 py-3">
                    Update profile Settings
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* ALL USERS: Notification center panel */}
          {activeMenuItem === "notifications" && (
            <Notification onUpdate={fetchUserInfo} />
          )}

        </Container>
      </div>
    </div>
  );
}

export default UserHome;
