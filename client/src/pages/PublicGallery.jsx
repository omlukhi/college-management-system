import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PublicGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/gallery')
      .then(res => {
        if (res.data.success) {
          setGallery(res.data.gallery);
        }
      })
      .catch(() => {
        setGallery([
          { albumName: "Campus Infrastructure", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80", description: "Main Administrative block and central lawns." },
          { albumName: "Academic Labs", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80", description: "Fully air-conditioned computer labs with high-speed internet." }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Campus Gallery</h1>
        <p className="lead text-muted">A sneak peek into our academic community, life, and campus events.</p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="cms-spinner"></div></div>
      ) : (
        <div className="row g-4">
          {gallery.map((img, idx) => (
            <div className="col-md-6 col-lg-4" key={idx}>
              <div className="cms-card p-0 h-100">
                <img
                  src={img.imageUrl.startsWith('/uploads') ? img.imageUrl : img.imageUrl}
                  alt={img.albumName}
                  className="img-fluid w-100"
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="p-3">
                  <h5 className="fw-bold text-primary">{img.albumName}</h5>
                  <p className="text-muted small mb-0">{img.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicGallery;
