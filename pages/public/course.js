import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Accordion, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CourseDetailWithChapters() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [visibleChaptersCount, setVisibleChaptersCount] = useState(6);
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `course/getbyid/${id}`;

  useEffect(() => {
    if (id) fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(apiUrl);
      const courseData = res.data.data;
      setCourse(courseData);
      setChapters(courseData?.chapters || []);
      if (courseData.courseType === 'multi' && courseData.chapters?.length > 0) {
        setSelectedChapter(courseData.chapters[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const filteredChapters = chapters.filter((chapter) =>
    chapter.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleChapters = filteredChapters.slice(0, visibleChaptersCount);

  return (
    <>
      <Head>
        <title>{course?.metaTitle || 'Course Details'} | {appName}</title>
        <meta
          name="description"
          content={course?.metaDescription || 'Default course description here'}
        />
      </Head>
      <Container className="my-4">
        <Row>
          <Col>
            <h2 className="text-primary mb-3">{course?.courseName || 'Course Details'}</h2>
            {course?.categories && course.categories.length > 0 && (
              <p className="text-muted">
                Categories: {course.categories.join(', ')}
              </p>
            )}
          </Col>
        </Row>

        <Row>
          {course?.courseType === 'single' ? (
            <Col>
              <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <Card.Title className="mb-3">{course.courseName}</Card.Title>
                  {course.youtubeLink ? (
                    <div className="ratio ratio-21x9 mb-3">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(course.youtubeLink)}`}
                        title={course.courseName}
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-muted">No video available for this course.</p>
                  )}
                  {course.videoCredits && (
                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                      <strong>Credits:</strong> {course.videoCredits}
                    </p>
                  )}
                  <strong className="text-muted">Description : </strong>
                  <div dangerouslySetInnerHTML={{ __html: course.description || 'No description available.' }} />
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <>
              <Col md={3}>
                <h4 className="mb-4 text-primary">Browse Chapters</h4>
                <Accordion defaultActiveKey="0" className="shadow-sm" style={{ borderRadius: '8px' }}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Course Chapters</Accordion.Header>
                    <Accordion.Body style={{ backgroundColor: '#f8f9fa' }}>
                      <Form.Control
                        type="text"
                        placeholder="Search Chapters"
                        className="mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '8px' }}
                      />
                      {visibleChapters.length > 0 ? (
                        <>
                          {visibleChapters.map((chapter) => (
                            <Button
                              key={chapter._id}
                              variant={selectedChapter?._id === chapter._id ? 'primary' : 'outline-secondary'}
                              className="w-100 mb-2"
                              onClick={() => setSelectedChapter(chapter)}
                              style={{
                                borderRadius: '8px',
                                fontWeight: selectedChapter?._id === chapter._id ? 'bold' : 'normal',
                              }}
                            >
                              {chapter.title}
                            </Button>
                          ))}
                          {visibleChapters.length < filteredChapters.length && (
                          <Button
                              variant="outline-primary"
                              className="w-100 mt-3 py-2 fw-semibold rounded-pill shadow-sm"
                              onClick={() => setVisibleChaptersCount(prev => prev + 5)}
                            >
                              + Load More Chapters
                            </Button>
                          )}
                        </>
                      ) : (
                        <p className="text-muted">No chapters found.</p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>

              <Col md={9}>
                {selectedChapter ? (
                  <Card className="shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Body>
                      <Card.Title className="mb-3">{selectedChapter.title}</Card.Title>
                      {selectedChapter.youtubeLink ? (
                        <div className="ratio ratio-21x9 mb-3">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(selectedChapter.youtubeLink)}`}
                            title={selectedChapter.title}
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <p className="text-muted">No video available for this chapter.</p>
                      )}
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedChapter.description || 'No description available.'}
                      </p>
                      {selectedChapter.credits && (
                        <p className="text-muted">
                          <strong>Credits:</strong> {selectedChapter.credits}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                ) : (
                  <p className="text-muted text-center">Select a chapter to view the video.</p>
                )}
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
}

function extractYouTubeId(url) {
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}