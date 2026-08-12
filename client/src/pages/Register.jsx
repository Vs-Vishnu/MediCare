import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { message } from "antd";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    type: "user", // Defaults to 'user', can also register as 'admin'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://medicare-uz8a.onrender.com/api/user/register", formData);
      if (response.data.success) {
        message.success(response.data.message || "Registration successful!");
        navigate("/login");
      } else {
        message.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error(error.response?.data?.message || "Something went wrong during registration");
    }
  };

  return (
    <div>
      {/* Floating Navbar */}
      <Navbar expand="lg" className="glass-nav">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MediCareBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center" style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5" style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <Row className="justify-content-center w-100 m-0">
          <Col md={8} lg={6}>
            <Card className="glass-panel p-4 border-0">
              <Card.Body>
                <h2 className="text-center mb-4" style={{ fontWeight: 800 }}>Create Account</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label style={{ fontWeight: 500 }}>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label style={{ fontWeight: 500 }}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label style={{ fontWeight: 500 }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label style={{ fontWeight: 500 }}>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formType">
                    <Form.Label style={{ fontWeight: 500 }}>Register As</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="glass-input form-control text-white"
                      style={{ background: 'rgba(11,15,25,0.9)' }}
                      required
                    >
                      <option value="user" style={{ background: '#1e293b' }}>Patient / User</option>
                      <option value="admin" style={{ background: '#1e293b' }}>Administrator</option>
                    </Form.Select>
                  </Form.Group>

                  <Button type="submit" className="btn-premium-primary w-100 py-3 mb-3">
                    Sign Up
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <span style={{ color: "var(--text-muted)" }}>Already registered? </span>
                  <Link to="/login" style={{ color: "var(--neon-teal)", textDecoration: "none", fontWeight: 600 }}>
                    Log In
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const Nav = ({ children, className }) => <div className={className}>{children}</div>;

export default Register;
