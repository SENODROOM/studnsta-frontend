import { useState } from "react";
import { updateProfile } from "../services/profileService";

function EditProfileModal({ user, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
    tagline: user?.tagline || "",
    activeNote: user?.activeNote || ""
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await updateProfile(formData);
      // Update local storage too if needed
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...res.data.user }));
      localStorage.setItem("userName", res.data.user.name);
      
      onUpdate(res.data.user);
      onClose();
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    color: 'var(--pure-pearl)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
    marginBottom: '1.25rem',
    fontFamily: 'var(--font-body)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.6rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        padding: '3rem',
        position: 'relative',
        background: 'rgba(25, 25, 30, 0.95)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        overflowY: 'auto'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>

        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--rich-lavender), var(--rich-lilac))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900',
          fontSize: '2rem',
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-header)'
        }}>
          Refine Your Identity
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your professional name"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Professional Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. REAL_MECHANISM 💸"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Intellectual Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="e.g. ESCAPE THE MATRIX ✨"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Status Note (Bubble)</label>
            <input
              type="text"
              name="activeNote"
              value={formData.activeNote}
              onChange={handleChange}
              placeholder="What's on your mind? (Note...)"
              style={inputStyle}
            />
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="glow-button"
            style={{
              width: '100%',
              padding: '1.15rem',
              fontSize: '1.1rem',
              marginTop: '1rem'
            }}
          >
            {isLoading ? 'Updating Identity...' : 'Save Refinements'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
