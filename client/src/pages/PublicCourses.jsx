import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/courses/courses')
      .then(res => {
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      })
      .catch(() => {
        // Fallback mock
        setCourses([
          { name: "Bachelor of Computer Applications (BCA)", duration_years: 3, semester_count: 6, department_name: "Computer Applications" },
          { name: "Master of Computer Applications (MCA)", duration_years: 2, semester_count: 4, department_name: "Computer Applications" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Academic Courses</h1>
        <p className="lead text-muted">Discover our professional UG and PG IT programs.</p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4">
          {courses.map((course, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="cms-card h-100">
                <h4 className="fw-bold text-primary mb-3">{course.name}</h4>
                <p className="mb-2"><strong>Department:</strong> {course.department_name}</p>
                <p className="mb-2"><strong>Duration:</strong> {course.duration_years} Years</p>
                <p className="mb-3"><strong>Total Semesters:</strong> {course.semester_count}</p>
                <p className="text-muted small">
                  Curriculum covers software engineering, web design, artificial intelligence, algorithms, databases, and practical lab projects.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicCourses;
