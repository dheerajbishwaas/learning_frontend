import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col md={12}>
          <h1 className="fw-bold mb-4">Contact Us</h1>
          <p className="lead text-muted">We're here to help. Drop us a message and we'll get back to you as soon as possible!</p>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="contact-info mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaEnvelope size={30} className="me-3" />
              <p className="m-0">support@example.com</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <FaPhoneAlt size={30} className="me-3" />
              <p className="m-0">+123 456 7890</p>
            </div>
            <div className="d-flex align-items-center">
              <FaMapMarkerAlt size={30} className="me-3" />
              <p className="m-0">123 Main Street, City, Country</p>
            </div>
          </div>
        </Col>

        <Col md={8}>
          <Form onSubmit={handleSubmit} className="contact-form p-4 shadow-lg bg-light rounded">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write your message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
