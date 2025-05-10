import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Accordion, Form } from 'react-bootstrap';
import Head from 'next/head';

export default function CourseListing() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [coursesToShow, setCoursesToShow] = useState(3);

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const categories = ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cyber Security'];

  const courses = [
    { title: 'React for Beginners', category: 'Web Development' },
    { title: 'Python for Data Science', category: 'Data Science' },
    { title: 'Deep Learning with TensorFlow', category: 'Machine Learning' },
    { title: 'Cloud Architecture on AWS', category: 'Cloud Computing' },
    { title: 'Ethical Hacking Basics', category: 'Cyber Security' },
    { title: 'Advanced JavaScript', category: 'Web Development' },
    { title: 'Data Structures and Algorithms', category: 'Data Science' },
    { title: 'AI Fundamentals', category: 'Machine Learning' },
    { title: 'AWS Solutions Architect', category: 'Cloud Computing' },
  ];

  const filteredCourses = courses.filter(course => {
    return (
      (activeCategory ? course.category === activeCategory : true) &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const loadMoreCourses = () => {
    setCoursesToShow(prev => prev + 3);
  };

  return (
    <>
     <Head>
        <title>Courses |{appName}</title>
    </Head>
    <Container className="my-4">
      {/* Category Filter Section */}
      <Row>
        <Col md={3}>
          <h4 className="mb-4 text-primary">Browse Courses by Category</h4>  {/* Added Heading with Color */}
          <Accordion defaultActiveKey="0" className="shadow-sm" style={{ borderRadius: '8px' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Course Categories</Accordion.Header>
              <Accordion.Body style={{ backgroundColor: '#f8f9fa' }}>
                {/* Category Search Bar */}
                <Form.Control
                  type="text"
                  placeholder="Search Categories"
                  className="mb-4"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />

                {/* Category Buttons */}
                {filteredCategories.map((category, index) => (
                  <Button 
                    key={index} 
                    variant="outline-secondary" 
                    className="w-100 mb-2"
                    onClick={() => setActiveCategory(category === activeCategory ? '' : category)}
                    style={{ borderRadius: '8px' }}
                  >
                    {category}
                  </Button>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* Course Search & Course List Section */}
        <Col md={9}>
          <h4 className="mb-4 text-primary">Search for a Course</h4>  {/* Added Heading for Search */}
          
          <Form.Control
            type="text"
            placeholder="Search Courses"
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '8px' }}
          />

          <h4 className="mb-4 text-primary">Explore Our Courses</h4>  {/* Added Heading for Courses */}
          
          {/* Course List */}
          <Row>
            {filteredCourses.slice(0, coursesToShow).map((course, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="h-100 shadow-lg" style={{ borderRadius: '10px' }}>  {/* Added Shadow and Border Radius */}
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text>{course.category}</Card.Text>
                    <Button variant="primary" className="w-100" style={{ borderRadius: '8px' }}>Learn More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Load More Button */}
          {filteredCourses.length > coursesToShow && (
            <Button 
              variant="outline-primary" 
              onClick={loadMoreCourses} 
              className="w-100"
              style={{ borderRadius: '8px' }}
            >
              Load More
            </Button>
          )}
        </Col>
      </Row>
    </Container>
    </>
  );
}
