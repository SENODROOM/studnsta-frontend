import { useState } from "react";
import { getPaper, deletePaper } from "../services/paperService";

function PaperCard({ paper, onInteraction, isTeacher }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleViewPdf = async () => {
    setIsLoading(true);
    try {
      const res = await getPaper(paper._id);
      setPdfUrl(`http://localhost:5000${res.data.pdfUrl}`);
      setShowPdf(true);
      onInteraction(); // Refresh to update download count
    } catch (error) {
      alert("Failed to load PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${paper.pdfUrl}`;
    link.download = `${paper.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onInteraction(); // Refresh to update download count
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this paper?")) {
      setIsLoading(true);
      try {
        await deletePaper(paper._id);
        onInteraction();
      } catch (error) {
        alert("Failed to delete paper");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPaperTypeColor = (type) => {
    switch (type) {
      case "Past Paper": return "#e3f2fd";

      case "Key Book": return "#e8f5e8";
      case "Notes": return "#fff3e0";
      default: return "#f5f5f5";
    }
  };

  const getPaperTypeTextColor = (type) => {
    switch (type) {
      case "Past Paper": return "#1976d2";

      case "Key Book": return "#388e3c";
      case "Notes": return "#f57c00";
      default: return "#666";
    }
  };

  return (
    <>
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        background: 'rgba(250, 250, 255, 0.95)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0', color: '#333', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 {paper.title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <div>
            Uploaded by <strong>{paper.uploadedBy.name}</strong> ({paper.uploadedBy.role})
          </div>
          <div>
            📥 {paper.downloads} downloads
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={handleViewPdf}
            disabled={isLoading}
            className="glow-button"
            style={{
              flex: 1,
              fontSize: '0.95rem',
              letterSpacing: '0.05em'
            }}
          >
            {isLoading ? 'Unlocking...' : '👁️ View Paper'}
          </button>
          
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            📥 Download
          </button>
          
          {isTeacher && paper.uploadedBy._id === localStorage.getItem("userId") && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isLoading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.9rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdf && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="glass-card" style={{
            width: '95%',
            height: '95%',
            maxWidth: '1400px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(250, 250, 255, 0.98)',
            padding: 0,
            overflow: 'hidden'
          }}>
            {/* PDF Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>{paper.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  📥 Download
                </button>
                <button
                  onClick={() => setShowPdf(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* PDF Content */}
            <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
              <iframe
                src={pdfUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title={paper.title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaperCard;
