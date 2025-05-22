import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import Image from 'next/image';
import heroImage from '../images/hero.png';
import Head from 'next/head';
import HomeCourse from '../components/HomeCourse';

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // Local input state (what user is typing)
  const [searchTerm, setSearchTerm] = useState('');

  // Actual search term to pass to HomeCourse
  const [searchQuery, setSearchQuery] = useState('');

  // When input becomes empty, reset searchQuery
  useEffect(() => {
    if (searchTerm.trim() === '' && searchQuery !== '') {
      setSearchQuery('');
    }
  }, [searchTerm]);

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim();
    if (trimmed !== searchQuery) {
      setSearchQuery(trimmed);
    }
  };

  return (
    <>
      <Head>
        <title>Welcome to {appName}</title>
      </Head>

      <Container className="py-5">
        <Row className="align-items-center">
          {/* Text Section */}
          <Col md={6} className="text-left text-md-start">
            <h1 className="fw-bold mb-3">
              Learn New <br /> Skills Online
            </h1>
            <p className="text-muted mb-4">
              Access a variety of courses and <br />
              expand your knowledge.
            </p>

            <InputGroup className="mb-4">
              <FormControl
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" onClick={handleSearchSubmit}>
                Search
              </Button>
            </InputGroup>
          </Col>

          {/* Image Section */}
          <Col md={6} className="text-end d-none d-md-block">
            <Image
              src={heroImage}
              alt="Learning Illustration"
              width={500}
              height={500}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Col>
        </Row>
      </Container>

      <HomeCourse externalSearch={searchQuery} />
    </>
  );
}
