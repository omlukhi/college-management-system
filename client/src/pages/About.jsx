import React from 'react';

function About() {
  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">About Apex Institute</h1>
        <p className="lead text-muted">Dedicated to academic excellence and student success since 2012.</p>
      </div>

      <div className="row g-4 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">Our Mission</h2>
          <p className="text-muted">
            To provide high-quality education in computer sciences and applications, fostering creativity, problem-solving skills, and ethical values in future leaders.
          </p>
          <h2 className="fw-bold mb-3 mt-4">Our Vision</h2>
          <p className="text-muted">
            To be recognized globally as a center of excellence for technical education, producing professionals ready to drive industrial and social innovations.
          </p>
        </div>
        <div className="col-lg-6">
          <div className="p-4 bg-light rounded shadow-sm border-start border-primary border-4">
            <h4 className="fw-bold text-primary mb-3">Core Values</h4>
            <ul className="text-muted mb-0">
              <li className="mb-2"><strong>Academic Integrity:</strong> Commitment to truth and rigorous study.</li>
              <li className="mb-2"><strong>Innovation:</strong> Nurturing forward-thinking technical research.</li>
              <li className="mb-2"><strong>Diversity:</strong> Creating a collaborative campus environment for all.</li>
              <li className="mb-0"><strong>Professional Excellence:</strong> Equipping students for global careers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
