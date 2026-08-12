import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Card, Spinner } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

// Import Components
import AdminAppointment from "../components/AdminAppointment";

function AdminHome() {
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("applications");
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch users
      const usersRes = await axios.get("https://medicare-uz8a.onrender.com/api/admin/getallusers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch doctors
      const doctorsRes = await axios.get("https://medicare-uz8a.onrender.com/api/admin/getalldoctors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
      if (doctorsRes.data.success) {
        setDoctors(doctorsRes.data.data);
        // Filter pending applications
        const pending = doctorsRes.data.data.filter(d => d.status === "pending");
        setPendingDocs(pending);
      }
    } catch (error) {
      console.error("Admin data loading error:", error);
      message.error("Failed to load admin workspace data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId, userid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://medicare-uz8a.onrender.com/api/admin/getapprove",
        { doctorId, userid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        message.success("Doctor approved successfully");
        fetchAdminData();
      }
    } catch (error) {
      console.error("Approval error:", error);
      message.error("Failed to approve application");
    }
  };

  const handleReject = async (doctorId, userid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://medicare-uz8a.onrender.com/api/admin/getreject",
        { doctorId, userid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        message.success("Doctor request rejected");
        fetchAdminData();
      }
    } catch (error) {
      console.error("Rejection error:", error);
      message.error("Failed to reject application");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Admin Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">MediCare Admin</div>
        <div className="sidebar-menu">
          <div 
            className={`sidebar-item ${activeMenuItem === "applications" ? "active" : ""}`}
            onClick={() => { setActiveMenuItem("applications"); fetchAdminData(); }}
          >
            Pending Applications ({pendingDocs.length})
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === "users" ? "active" : ""}`}
            onClick={() => { setActiveMenuItem("users"); fetchAdminData(); }}
          >
            Registered Users
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === "doctors" ? "active" : ""}`}
            onClick={() => { setActiveMenuItem("doctors"); fetchAdminData(); }}
          >
            Registered Doctors
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === "appointments" ? "active" : ""}`}
            onClick={() => setActiveMenuItem("appointments")}
          >
            Appointments Archive
          </div>
          <div className="sidebar-item mt-auto text-danger" onClick={handleLogout}>
            Logout Admin
          </div>
        </div>
      </div>

      {/* Admin Main Body */}
      <div className="main-content">
        <div className="header-panel">
          <div className="header-user">
            <h4>System Governance Workspace</h4>
            <span className="status-badge status-approved">Root Administrator</span>
          </div>
        </div>

        <Container fluid className="p-0">
          
          {/* Applications list */}
          {activeMenuItem === "applications" && (
            <div className="glass-panel p-4 border-0">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Practitioner Applications</h2>
              {pendingDocs.length === 0 ? (
                <Alert variant="success" style={{ background: "rgba(52,211,153,0.1)", borderColor: "var(--neon-teal)", color: "white" }}>
                  All practitioner applications have been reviewed. Clean queue!
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table className="premium-table mb-0">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Specialty</th>
                        <th>Experience</th>
                        <th>Consultation Fees</th>
                        <th>Timings</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDocs.map((doc) => (
                        <tr key={doc._id}>
                          <td>Dr. {doc.fullName}</td>
                          <td>{doc.specialization}</td>
                          <td>{doc.experience} Years</td>
                          <td>${doc.fees}</td>
                          <td>{doc.timings ? `${doc.timings[0]} - ${doc.timings[1]}` : "N/A"}</td>
                          <td>{doc.phone}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                size="sm" 
                                className="btn-premium-primary"
                                onClick={() => handleApprove(doc._id, doc.userID)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger" 
                                style={{ borderRadius: "8px" }}
                                onClick={() => handleReject(doc._id, doc.userID)}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* User Database list */}
          {activeMenuItem === "users" && (
            <div className="glass-panel p-4 border-0">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>User Accounts Registry</h2>
              <div className="table-responsive">
                <Table className="premium-table mb-0">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Access Role</th>
                      <th>Doctor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{u._id}</td>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <span className="status-badge" style={{ background: "rgba(255,255,255,0.05)", color: "white" }}>
                            {u.type}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${u.isdoctor ? "approved" : "pending"}`}>
                            {u.isdoctor ? "Certified Doctor" : "Regular Patient"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {/* Doctor Registry list */}
          {activeMenuItem === "doctors" && (
            <div className="glass-panel p-4 border-0">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Practitioner Registry</h2>
              <div className="table-responsive">
                <Table className="premium-table mb-0">
                  <thead>
                    <tr>
                      <th>Practitioner Name</th>
                      <th>Specialty</th>
                      <th>Experience</th>
                      <th>Clinic Address</th>
                      <th>Consultation Fee</th>
                      <th>Governance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d._id}>
                        <td>Dr. {d.fullName}</td>
                        <td>{d.specialization}</td>
                        <td>{d.experience} Years</td>
                        <td>{d.address}</td>
                        <td>${d.fees}</td>
                        <td>
                          <span className={`status-badge status-${d.status}`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {/* Appointments Archive */}
          {activeMenuItem === "appointments" && (
            <AdminAppointment />
          )}

        </Container>
      </div>
    </div>
  );
}

export default AdminHome;
