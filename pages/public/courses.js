import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Accordion, Form } from 'react-bootstrap';
import axios from 'axios';

export default function CourseListing() {
  const [activeCategory, setActiveCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const apiUrlCategory = process.env.NEXT_PUBLIC_API_URL + 'course/categories/getAllCategorys';
  const apiUrlCourse = process.env.NEXT_PUBLIC_API_URL + 'course/all';

  // Fetch categories
  const fetchCategories = async (searchTerm = '') => {
    try {
      const res = await axios.get(apiUrlCategory, {
        params: { search: searchTerm }
      });
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async (pageNum = 1, catId = '', search = '', append = false) => {
    setLoadingCourses(true);
    try {
      console.log('📦 Fetching with cat_id:', catId); // Log to debug

      const res = await axios.get(apiUrlCourse, {
        params: {
          page: pageNum,
          limit: 9,
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

  // Fetch on load & when search/filter changes
  useEffect(() => {
    fetchCategories(categorySearch);
  }, [categorySearch]);

  useEffect(() => {
    fetchCourses(1, activeCategory, courseSearch, false);
  }, [activeCategory, courseSearch]);

  const loadMoreCourses = () => {
    fetchCourses(page + 1, activeCategory, courseSearch, true);
  };

  const handleCategoryClick = (catId) => {
    setCourses([]); // clear courses
    // Toggle logic
    setActiveCategory((prev) => (prev === catId ? '' : catId));
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={3}>
          <h4 className="mb-4 text-primary">Browse Courses by Category</h4>
          <Accordion defaultActiveKey="0" className="shadow-sm" style={{ borderRadius: '8px' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Course Categories</Accordion.Header>
              <Accordion.Body style={{ backgroundColor: '#f8f9fa' }}>
                <Form.Control
                  type="text"
                  placeholder="Search Categories"
                  className="mb-4"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
                {categories.map((cat) => (
                  <Button
                    key={cat._id || cat.id}
                    variant={activeCategory === cat._id ? 'primary' : 'outline-secondary'}
                    className="w-100 mb-2"
                    onClick={() => handleCategoryClick(cat._id)}
                    style={{
                      borderRadius: '8px',
                      fontWeight: activeCategory === cat._id ? 'bold' : 'normal',
                    }}
                  >
                    {cat.name}
                  </Button>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        <Col md={9}>
          <h4 className="mb-4 text-primary">Search for a Course</h4>
          <Form.Control
            type="text"
            placeholder="Search Courses"
            className="mb-4"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            style={{ borderRadius: '8px' }}
          />

          <h4 className="mb-4 text-primary">Explore Our Courses</h4>
          <Row>
            {courses.length === 0 && !loadingCourses ? (
              <Col>
                <p className="text-center text-muted">No courses found.</p>
              </Col>
            ) : (
              courses.map((course, idx) => (
                <Col md={4} key={course._id || idx} className="mb-4">
                  <Card className="h-100 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Body>
                      <Card.Title>{course.courseName}</Card.Title>
                      <Card.Text>
                        {course.categories?.length
                          ? course.categories.map((c) => c.name).join(', ')
                          : 'No category'}
                      </Card.Text>
                      <Button variant="primary" className="w-100" style={{ borderRadius: '8px' }}>
                        Learn More
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

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
        </Col>
      </Row>
    </Container>
  );
}
