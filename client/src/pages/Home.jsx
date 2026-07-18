import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="fade-in-up">
      {/* Hero Section */}
      <section
        className="py-5 text-white d-flex align-items-center"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          minHeight: '60vh',
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Empowering Innovation, Shaping Tomorrow</h1>
              <p className="lead mb-4 text-light">
                Welcome to Apex Institute of Technology. A premier hub for education, technology, and comprehensive career development.
              </p>
              <div className="d-flex gap-3">
                <Link className="btn btn-light btn-lg px-4 fw-bold text-primary" to="/courses">Explore Courses</Link>
                <Link className="btn btn-outline-light btn-lg px-4" to="/contact">Admissions</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 hero-glass">
                <h3 className="h4 mb-3 text-white">Latest Announcements</h3>
                <ul className="list-unstyled text-light">
                  <li className="mb-2">📣 Semester registrations for BCA/MCA start from July 15.</li>
                  <li className="mb-2">🏆 Smart India Hackathon internal selections announced.</li>
                  <li className="mb-0">📚 Campus Library hours extended till 8:00 PM during exams.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Statistics */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="cms-card">
                <h2 className="display-5 fw-bold text-primary">1200+</h2>
                <p className="text-muted mb-0">Active Students</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cms-card">
                <h2 className="display-5 fw-bold text-primary">85+</h2>
                <p className="text-muted mb-0">Expert Faculty</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cms-card">
                <h2 className="display-5 fw-bold text-primary">95%</h2>
                <p className="text-muted mb-0">Placement Rate</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cms-card">
                <h2 className="display-5 fw-bold text-primary">25+</h2>
                <p className="text-muted mb-0">Global Partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placements Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)' }}>Our Top Recruiters</h2>
          <div className="row g-4 justify-content-center align-items-center text-center">
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-muted fw-bold">Infosys</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-muted fw-bold">Wipro</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-muted fw-bold">TCS</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded text-muted fw-bold">Capgemini</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)' }}>Frequently Asked Questions</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item mb-3 border-0 shadow-sm rounded">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button fw-semibold rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                      What are the eligibility criteria for BCA/MCA?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      For BCA, candidates must have completed 10+2 with Mathematics/Computer Application as a subject with at least 50% marks. For MCA, a Bachelor's degree in Computer Science/Applications or relevant streams is required.
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-3 border-0 shadow-sm rounded">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed fw-semibold rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                      Does the college provide campus placements?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes, our active Training & Placement cell brings in top recruiters such as Infosys, Wipro, and TCS, offering multiple job opportunities to graduates.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
