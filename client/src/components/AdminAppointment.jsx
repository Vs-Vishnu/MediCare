import React, { useState, useEffect } from "react";
import { Table, Alert, Spinner } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function AdminAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/admin/getallAppointmentsAdmin",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        message.error(response.data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Fetch appointments error:", error);
      message.error("Error loading appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="info" />
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 border-0">
      <h2 className="mb-4" style={{ fontWeight: 800 }}>Appointment Database</h2>
      {appointments.length === 0 ? (
        <Alert variant="info" style={{ background: "rgba(14,165,233,0.1)", borderColor: "var(--neon-blue)", color: "white" }}>
          No appointments scheduled on the platform.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table className="premium-table mb-0">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Scheduled Date & Time</th>
                <th>File Attachment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{app._id}</td>
                  <td>{app.userInfo ? app.userInfo.fullName : "Unknown Patient"}</td>
                  <td>Dr. {app.doctorInfo ? app.doctorInfo.fullName : "Unknown Doctor"}</td>
                  <td>{app.date ? app.date.replace("T", " ") : "N/A"}</td>
                  <td>
                    {app.document && app.document.path ? (
                      <a 
                        href={`http://localhost:8000/uploads/${app.document.path.split(/[/\\]/).pop()}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: "var(--neon-teal)", textDecoration: "none", fontWeight: 500 }}
                      >
                        {app.document.filename || "View File"}
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
  );
}

export default AdminAppointment;
