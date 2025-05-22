// pages/index.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';

export default function HomeCourse(props) {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [courseSearch, setCourseSearch] = useState(props.externalSearch || '');
  const [page, setPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const apiUrlCategory = process.env.NEXT_PUBLIC_API_URL + 'course/categories/getAllCategorys';
  const apiUrlCourse = process.env.NEXT_PUBLIC_API_URL + 'course/all';

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(apiUrlCategory);
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async (pageNum = 1, catId = '', search = '', append = false) => {
    setLoadingCourses(true);
    try {
      const res = await axios.get(apiUrlCourse, {
        params: {
          page: pageNum,
          limit: 6,
          cat_id: catId || undefined,
          search: search || undefined,
        },
      });

      const newCourses = res.data.data || [];

      if (append) {
        setCourses((prev) => [...prev, ...newCourses]);
      } else {
        setCourses(newCourses);
      }

      setTotalCourses(res.data.total || 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoadingCourses(false);
  };

  // On initial load
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    setCourseSearch(props.externalSearch || '');
  }, [props.externalSearch]);

  // On filter/search change
  useEffect(() => {
    fetchCourses(1, activeCategory, courseSearch, false);
  }, [activeCategory, courseSearch]);

  const loadMoreCourses = () => {
    fetchCourses(page + 1, activeCategory, courseSearch, true);
  };

  const handleCategoryClick = (catId) => {
    setCourses([]);
    setActiveCategory((prev) => (prev === catId ? '' : catId));
  };

  return (
    <Container className="my-4">
      {/* Categories - Swiper */}
      <h3 className="text-primary">Browse by Category</h3>
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
            <Card
              className={`text-center shadow-sm h-100 ${activeCategory === cat._id ? 'border-primary' : ''}`}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                minHeight: '120px',
                padding: '16px',           
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => handleCategoryClick(cat._id)}
            >
              <Card.Body className="p-2"> 
                <div
                  style={{
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${cat.icon}`}
                    alt="Preview"
                    style={{
                      maxHeight: '50px',
                      width: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </div>
                <Card.Title
                  className="mt-2 mb-0"
                  style={{
                    fontWeight: activeCategory === cat._id ? 'bold' : 'normal',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cat.name}
                </Card.Title>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Courses List */}
      <h3 className="mb-4 text-primary">Featured Courses</h3>
      <Row>
        {courses.length === 0 && !loadingCourses ? (
          <Col>
            <p className="text-center text-muted">No courses found.</p>
          </Col>
        ) : (
          courses.map((course, idx) => (
            <Col md={4} className="mb-4" key={course._id || idx}>
              <Card className="h-100 shadow-sm" style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <Card.Title>{course.courseName}</Card.Title>
                  <Card.Text>
                    {course.categories?.length
                      ? course.categories.map((c) => c.name).join(', ')
                      : 'No category'}
                  </Card.Text>
                  <Link href={`/course/${course._id}`} passHref legacyBehavior>
                    <Button variant="primary" className="w-100" style={{ borderRadius: '8px' }}>
                      Learn More
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Load More */}
      {courses.length < totalCourses && (
        <Button
          variant="outline-primary"
          onClick={loadMoreCourses}
          className="w-100"
          disabled={loadingCourses}
          style={{ borderRadius: '8px' }}
        >
          {loadingCourses ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Container>
  );
}
