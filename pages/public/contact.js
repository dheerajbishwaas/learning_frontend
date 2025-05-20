import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Head from 'next/head';
import axios from 'axios'; // 1. Add this at the top
import { toast, ToastContainer } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission here
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}users/contact`, formData);
      
      if (res.data?.success) {
        toast.success('Your message has been sent successfully!', {
          onClose: () => {
            setFormData({ name: '', email: '', message: '' }); // Reset form
          }
        });

      } else {
         toast.error('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    }
    finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <>
     <Head>
        <title>Contact us | {appName}</title>
    </Head>
    <ToastContainer/>
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
              <p className="m-0">timelessspecials@gmail.com</p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <FaPhoneAlt size={30} className="me-3" />
              <p className="m-0">+700 937 0137</p>
            </div>
            <div className="d-flex align-items-center">
              <FaMapMarkerAlt size={30} className="me-3" />
              <p className="m-0"># 701/2 Street 0 Aman nagar, Ludhiana Punjab, India</p>
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

            <Button variant="primary" type="submit"  disabled={isSubmitting} className="w-100 mt-3">
               {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Contact;
