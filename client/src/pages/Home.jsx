import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Button, Card } from "react-bootstrap";
import heroImg from "../assets/hero_doctor.png";

function Home() {
  return (
    <div className="landing-page">
      {/* Floating Navbar */}
      <Navbar expand="lg" className="glass-nav sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MediCareBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="active">Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <Button as={Link} to="/login" className="btn-premium-primary ms-3">Book Now</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="hero-sec">
        <Row className="align-items-center">
          <Col lg={6} className="hero-img-container mb-5 mb-lg-0 text-center">
            <img src={heroImg} alt="Doctor Hologram" className="hero-img img-fluid" style={{ maxHeight: "500px", objectFit: "cover" }} />
          </Col>
          <Col lg={6} className="ps-lg-5">
            <h1 className="hero-title">Your Health, Secured & Simplified.</h1>
            <p className="hero-subtitle">
              Connect with top-rated medical practitioners, schedule virtual or physical check-ups, upload prescriptions securely, and receive updates in real-time. Experience modern healthcare built around your lifestyle.
            </p>
            <div className="d-flex gap-3">
              <Button as={Link} to="/login" className="btn-premium-primary">
                Book your Doctor
              </Button>
              <Button as={Link} to="/register" variant="outline-light" className="px-4 py-2" style={{ borderRadius: '12px' }}>
                Join as Patient
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* About Us Section */}
      <Container className="my-5 py-5">
        <h2 className="text-center mb-5" style={{ fontWeight: 800 }}>Why Choose MediCareBook?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="glass-panel about-card text-center border-0">
              <Card.Body>
                <h3>Verified Medical Staff</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  Every practitioner registration is rigorously validated and approved by administrators, ensuring you interact only with licensed healthcare workers.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-panel about-card text-center border-0">
              <Card.Body>
                <h3>Flexible Timings</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  Easily view availability windows, pick slots that perfectly fit your calendar, and receive automatic confirmation alerts via SMS or email.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-panel about-card text-center border-0">
              <Card.Body>
                <h3>Encrypted Records</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  Upload lab results, scan reports, or medical history directly into your booking request securely. All files are encrypted and private.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer mt-5">
        <Container>
          <p className="mb-0">© {new Date().getFullYear()} MediCareBook Systems. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
