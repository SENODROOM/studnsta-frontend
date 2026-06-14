import { useEffect, useState } from "react";
import { getPapers } from "../services/paperService";
import PaperCard from "../components/PaperCard";
import UploadPaperModal from "../components/UploadPaperModal";

function Papers() {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "guest");
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const res = await getPapers({});
      setPapers(res.data);
    } catch (error) {
      console.log("Failed to fetch papers");
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = () => {
    fetchPapers();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'transparent',
      padding: '2rem'
    }}>
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.2rem', 
              fontWeight: '900'
            }}>
              📚 Course Notes & PDFs
            </h1>
            <p style={{ margin: '0.4rem 0 0 0', color: 'var(--midnight-charcoal)', opacity: 0.7, fontSize: '1rem', fontWeight: '500' }}>
              Download PDF books, course notes, and study materials
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="glow-button"
            style={{
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>➕</span> Upload PDF
          </button>
        </div>
      </div>



      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading papers...</div>
        </div>
      )}

      {/* Papers List */}
      {!isLoading && papers.map((paper) => (
        <PaperCard 
          key={paper._id} 
          paper={paper} 
          onInteraction={handleInteraction}
          isTeacher={userRole === "teacher"}
        />
      ))}

      {/* Empty State */}
      {!isLoading && papers.length === 0 && (
        <div className="glass-card" style={{
          padding: '5rem 3rem',
          textAlign: 'center',
          background: 'rgba(250, 250, 255, 0.95)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>No PDFs Found</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            There are currently no notes or PDF books available. Check back later!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadPaperModal
          onClose={() => setShowUploadModal(false)}
          onPaperUploaded={fetchPapers}
        />
      )}
    </div>
  );
}

export default Papers;