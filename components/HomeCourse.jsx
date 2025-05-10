// pages/index.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function HomeCourse() {
  const categories = [
    { name: 'Web Development', icon: '💻' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Machine Learning', icon: '🤖' },
    { name: 'Cloud Computing', icon: '☁️' },
    { name: 'Cyber Security', icon: '🛡️' },
    { name: 'Mobile Development', icon: '📱' },
    { name: 'UI/UX Design', icon: '🎨' },
    { name: 'Blockchain', icon: '🔗' },
    { name: 'DevOps', icon: '🛠️' },
    { name: 'Game Development', icon: '🎮' },
  ];

  const courses = [
    {
      title: 'React for Beginners',
      instructor: 'John Doe',
      tag: 'Web Development',
      color: 'primary',
    },
    {
      title: 'Python for Data Analysis',
      instructor: 'Jane Smith',
      tag: 'Data Science',
      color: 'info',
    },
    {
      title: 'Machine Learning A-Z',
      instructor: 'David Brown',
      tag: 'Machine Learning',
      color: 'warning',
    },
  ];

  const allCourses = [...courses, ...courses, ...courses]; // 9 items (3 rows of 3)

  return (
    <Container className="my-4">
      {/* Browse by Category - with Swiper */}
      <h3>Browse by Category</h3>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        breakpoints={{
          320: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
        }}
        className="my-3"
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={idx}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                <Card.Title className="mt-2">{cat.name}</Card.Title>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Courses */}
      <h3>Featured Courses</h3>
      <Row className="mt-3">
        {allCourses.map((course, idx) => (
          <Col md={4} className="mb-4" key={idx}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.instructor}</Card.Text>
                <Button variant={course.color}>{course.tag}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
