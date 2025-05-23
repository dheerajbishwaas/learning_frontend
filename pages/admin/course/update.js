import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Select from 'react-select';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const UpdateCourse = () => {
  const router = useRouter();
  const { id } = router.query;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    courseName: '',
    courseType: 'single',
    description: '',
    youtubeLink: '',
    videoCredits: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    categories: [],
  });

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/getAllCategory`)
      .then((res) => {
        const formatted = res.data.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategoryOptions(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
  }, []);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      setLoading(true);

      axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/getCourseById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          const course = res.data.data;
          setFormData({
            courseName: course.courseName,
            courseType: course.courseType,
            description: course.description,
            youtubeLink: course.youtubeLink,
            videoCredits: course.videoCredits,
            status: course.status,
            metaTitle: course.metaTitle,
            metaDescription: course.metaDescription,
            categories: course.categories || [],
          });

          if (course.courseType === 'multi') {
            setChapters(course.chapters || [{
              title: '',
              youtubeLink: '',
              description: '',
              credits: ''
            }]);
          } else {
            setChapters([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load course:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const selectedCategories = categoryOptions.filter(option =>
    formData.categories.includes(option.value)
  );

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleChapterChange = (index, field, value) => {
    setChapters(prev =>
      prev.map((chapter, i) =>
        i === index ? { ...chapter, [field]: value } : chapter
      )
    );
  };

  const addNewChapter = () => {
    setChapters(prev => [
      ...prev,
      {
        title: '',
        youtubeLink: '',
        description: '',
        credits: ''
      }
    ]);
  };

  const removeChapter = (index) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const courseData = {
        ...formData,
        chapters: formData.courseType === 'multi' ? chapters : undefined
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}course/update/${id}`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Course updated successfully', {
        onClose: () => {
          router.push('/admin/course');
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="container my-4">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Update Course | {appName}</title>
      </Head>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Update Course</h1>
          <Link href="/admin/course" className="btn btn-outline-secondary">
            Back to Courses
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Course Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Basic Information</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="courseName" className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Type</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="singleChapter"
                      name="courseType"
                      value="single"
                      checked={formData.courseType === 'single'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="singleChapter">
                      Single Chapter
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="multiChapter"
                      name="courseType"
                      value="multi"
                      checked={formData.courseType === 'multi'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="multiChapter">
                      Multi-Chapter
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                {typeof window !== 'undefined' && (
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleEditorChange}
                    className="bg-white"
                  />
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="categories" className="form-label">Categories</label>
                <Select
                  isMulti
                  name="categories"
                  options={categoryOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  placeholder="Select categories..."
                />
              </div>
            </div>
          </div>

          {/* Video Information */}
          {formData.courseType === 'single' ? (
            <div className="card mb-4">
              <div className="card-header">
                <h3>Video Information</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="youtubeLink" className="form-label">YouTube Link</label>
                  <input
                    type="url"
                    className="form-control"
                    id="youtubeLink"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="videoCredits" className="form-label">Credits</label>
                  <textarea
                    className="form-control"
                    id="videoCredits"
                    name="videoCredits"
                    rows="3"
                    value={formData.videoCredits}
                    onChange={handleChange}
                    placeholder="Give credit to the video creator"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Chapter Videos</h3>
                <button type="button" className="btn btn-sm btn-primary" onClick={addNewChapter}>
                  Add Chapter
                </button>
              </div>
              <div className="card-body">
                {chapters.map((chapter, index) => (
                  <div key={index} className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>Chapter {index + 1}</h5>
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeChapter(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">YouTube Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={chapter.youtubeLink}
                        onChange={(e) => handleChapterChange(index, 'youtubeLink', e.target.value)}
                        required
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={chapter.description}
                        onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Credits</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={chapter.credits}
                        onChange={(e) => handleChapterChange(index, 'credits', e.target.value)}
                        placeholder="Give credit to the video creator"
                      />
                    </div>
                  </div>
                ))}
              </div>
               <div className="d-flex justify-content-center mt-3 mb-3">
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4"
                  onClick={addNewChapter}
                >
                  Add Chapter
                </button>
              </div>
            </div>
          )}

          {/* SEO and Status Sections */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>SEO Information</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="metaTitle" className="form-label">Meta Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength="60"
                />
                <small className="text-muted">Recommended: 50-60 characters</small>
              </div>

              <div className="mb-3">
                <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                <textarea
                  className="form-control"
                  id="metaDescription"
                  name="metaDescription"
                  rows="3"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  maxLength="160"
                />
                <small className="text-muted">Recommended: 150-160 characters</small>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3>Status</h3>
            </div>
            <div className="card-body">
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Update Course
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default UpdateCourse;