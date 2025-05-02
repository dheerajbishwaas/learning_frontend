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
// Dynamically import the editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const UpdateCourse = () => {
  const router = useRouter();
  const { id } = router.query; // id will be dynamic based on the URL
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Main form state
  const [formData, setFormData] = useState({
    courseName: '',
    courseType: 'single', // 'single' or 'multi'
    description: '',
    youtubeLink: '',
    videoCredits: '',
    status: 'draft', // 'draft', 'published', 'disabled'
    metaTitle: '',
    metaDescription: '',
    categories: [],
  });
  
  // State for multi-chapter videos
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '',
      youtubeLink: '',
      description: '',
      credits: ''
    }
  ]);
  
  // Categories options
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}course/categories/getAllCategory`)
      .then((res) => {
        const formatted = res.data.data.map((cat, index) => ({
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
          setChapters(course.chapters || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load course:", err);
      });
    }
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle category selection
  const handleCategoryChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  }; 
  
  const selectedCategories = categoryOptions.filter(option => 
    formData.categories.includes(option.value)
  );

  // Handle editor content change
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };
  
  // Handle chapter changes
  const handleChapterChange = (id, field, value) => {
    setChapters(prev => 
      prev.map(chapter => 
        chapter.id === id ? { ...chapter, [field]: value } : chapter
      )
    );
  };
  
  // Add new chapter
  const addNewChapter = () => {
    setChapters(prev => [
      ...prev,
      {
        id: prev.length + 1,
        title: '',
        youtubeLink: '',
        description: '',
        credits: ''
      }
    ]);
  };
  
  // Remove chapter
  const removeChapter = (id) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter(chapter => chapter.id !== id));
    }
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine form data with chapters if multi-chapter course
    const courseData = formData.courseType === 'multi' 
      ? { ...formData, chapters } 
      : formData;
    
      try {
        const token = localStorage.getItem('token');
        const courseId = id; // Replace this with your dynamic ID if needed
      
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}course/update/${courseId}`,
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
            router.push('/admin/course');  // Redirect after toast is dismissed
          }
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'; 
        toast.error(errorMessage);
      }
      
      
  };

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
                      Single Chapter (Full Course)
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
                      Multi-Chapter Course
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Course Description</label>
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
                  closeMenuOnSelect={false}
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
                  <label htmlFor="youtubeLink" className="form-label">YouTube Video Link</label>
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
                  <label htmlFor="videoCredits" className="form-label">Video Credits</label>
                  <textarea
                    className="form-control"
                    id="videoCredits"
                    name="videoCredits"
                    rows="3"
                    value={formData.videoCredits}
                    onChange={handleChange}
                    placeholder="Credit information about the video creator"
                  ></textarea>
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
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>Chapter {chapter.id}</h5>
                      {chapters.length > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger"
                          onClick={() => removeChapter(chapter.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`chapterTitle-${chapter.id}`} className="form-label">Chapter Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`chapterTitle-${chapter.id}`}
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(chapter.id, 'title', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`chapterYoutubeLink-${chapter.id}`} className="form-label">YouTube Video Link</label>
                      <input
                        type="url"
                        className="form-control"
                        id={`chapterYoutubeLink-${chapter.id}`}
                        value={chapter.youtubeLink}
                        onChange={(e) => handleChapterChange(chapter.id, 'youtubeLink', e.target.value)}
                        required
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`chapterDescription-${chapter.id}`} className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id={`chapterDescription-${chapter.id}`}
                        rows="3"
                        value={chapter.description}
                        onChange={(e) => handleChapterChange(chapter.id, 'description', e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`chapterCredits-${chapter.id}`} className="form-label">Video Credits</label>
                      <textarea
                        className="form-control"
                        id={`chapterCredits-${chapter.id}`}
                        rows="2"
                        value={chapter.credits}
                        onChange={(e) => handleChapterChange(chapter.id, 'credits', e.target.value)}
                        placeholder="Credit information about the video creator"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* SEO Information */}
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
                <small className="text-muted">Recommended length: 50-60 characters</small>
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
                ></textarea>
                <small className="text-muted">Recommended length: 150-160 characters</small>
              </div>
            </div>
          </div>
          
          {/* Course Status */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Course Status</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
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
          </div>
          
          {/* Form Submission */}
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Update Course
            </button>
          </div>
        </form>
        <ToastContainer/>
      </div>
    </>
  );
};

export default UpdateCourse;
