import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { message } from "antd";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post("http://localhost:8000/api/user/login", formData);
      if (response.data.success) {
        message.success(response.data.message || "Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        
        // Role based redirect
        if (response.data.data.type === "admin") {
          navigate("/adminhome");
        } else {
          navigate("/userhome");
        }
      } else {
        message.error(response.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.response?.data?.message || "Something went wrong during login");
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
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
              <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <Row className="justify-content-center w-100 m-0">
          <Col md={6} lg={5}>
            <Card className="glass-panel p-4 border-0">
              <Card.Body>
                <h2 className="text-center mb-4" style={{ fontWeight: 800 }}>Welcome Back</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ fontWeight: 500 }}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label style={{ fontWeight: 500 }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" className="btn-premium-primary w-100 py-3 mb-3">
                    Sign In
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <span style={{ color: "var(--text-muted)" }}>Don't have an account? </span>
                  <Link to="/register" style={{ color: "var(--neon-teal)", textDecoration: "none", fontWeight: 600 }}>
                    Register Here
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

// Inline Nav fix for layout
const Nav = ({ children, className }) => <div className={className}>{children}</div>;

export default Login;
