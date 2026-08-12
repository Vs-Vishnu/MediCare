import React, { useState, useEffect } from "react";
import { Tabs, Tab, Button, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

function Notification({ onUpdate }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUserData = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(userData);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://medicare-uz8a.onrender.com/api/user/getallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        message.success("All notifications marked as read");
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        setUser(response.data.data);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Mark read error:", error);
      message.error("Failed to mark notifications as read");
    }
  };

  const deleteAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://medicare-uz8a.onrender.com/api/user/deleteallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        message.success("All read notifications cleared");
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        setUser(response.data.data);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Delete notifications error:", error);
      message.error("Failed to clear notifications");
    }
  };

  if (!user) return null;

  return (
    <Card className="glass-panel p-4 border-0">
      <Card.Body>
        <h2 className="mb-4" style={{ fontWeight: 800 }}>Notification Center</h2>
        <Tabs defaultActiveKey="unread" id="notification-tabs" className="mb-4 text-white">
          <Tab eventKey="unread" title={`Unread (${user.notification?.length || 0})`}>
            <div className="d-flex justify-content-end mb-3">
              {user.notification?.length > 0 && (
                <Button className="btn-premium-primary" onClick={markAllRead}>
                  Mark all read
                </Button>
              )}
            </div>
            {user.notification?.length === 0 ? (
              <div className="text-center text-muted py-4">No unread notifications</div>
            ) : (
              <ListGroup variant="flush">
                {user.notification.map((item, idx) => (
                  <ListGroup.Item 
                    key={idx} 
                    className="bg-transparent text-white border-0 py-3 mb-2 rounded glass-panel"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (item.onClickPath) navigate(item.onClickPath);
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{item.message}</div>
                    <small className="text-muted">Click to view details</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Tab>
          
          <Tab eventKey="read" title={`Read (${user.seennotification?.length || 0})`}>
            <div className="d-flex justify-content-end mb-3">
              {user.seennotification?.length > 0 && (
                <Button className="btn-premium-accent" onClick={deleteAllRead}>
                  Delete all
                </Button>
              )}
            </div>
            {user.seennotification?.length === 0 ? (
              <div className="text-center text-muted py-4">No read notifications</div>
            ) : (
              <ListGroup variant="flush">
                {user.seennotification.map((item, idx) => (
                  <ListGroup.Item 
                    key={idx} 
                    className="bg-transparent text-white border-0 py-3 mb-2 rounded glass-panel"
                  >
                    <div style={{ fontWeight: 400, color: "var(--text-muted)" }}>{item.message}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default Notification;
