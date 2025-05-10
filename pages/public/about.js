import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaBook, FaChalkboardTeacher, FaHandshake } from 'react-icons/fa';
import Head from 'next/head';

const About = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <> 
    <Head>
        <title>About us |{appName}</title>
    </Head>
    <Container className="py-5">
      <Row className="text-center">
        <Col md={12}>
          <h1 className="fw-bold mb-4">About Us</h1>
          <p className="lead text-muted">
            Welcome to our platform, where learning has no limits. Our mission is to provide free education to anyone who wants to learn. Whether you're a student or someone looking to expand your knowledge, we offer a wide range of free courses that you can start today!
          </p>
        </Col>
      </Row>

      {/* Mission Statement */}
      <Row className="my-5 text-center">
        <Col md={4}>
          <FaBook size={50} color="#007BFF" />
          <h3 className="mt-3">Wide Range of Courses</h3>
          <p>
            We offer a variety of courses across different subjects, from programming to design, and everything in between.
          </p>
        </Col>
        <Col md={4}>
          <FaChalkboardTeacher size={50} color="#28A745" />
          <h3 className="mt-3">Learn From Experts</h3>
          <p>
            Our content comes from experienced instructors and professionals who are passionate about sharing their knowledge.
          </p>
        </Col>
        <Col md={4}>
          <FaHandshake size={50} color="#FFC107" />
          <h3 className="mt-3">Collaborative Learning</h3>
          <p>
            Join a community of learners. Exchange ideas, share your experiences, and grow together.
          </p>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="text-center my-5">
        <Col md={12}>
          <h2 className="fw-bold">Start Learning for Free Today!</h2>
          <p className="text-muted mb-4">
            Whether you're looking to improve your skills or explore new areas, our platform offers the best free learning resources, including YouTube courses and more.
          </p>
          <Button variant="primary" size="lg" href="/courses">
            Explore Courses
          </Button>
        </Col>
      </Row>
    </Container></>
  );
};

export default About;
