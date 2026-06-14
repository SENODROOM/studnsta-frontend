import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userRole", res.data.user.role);
      navigate("/home");
    } catch (error) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 10px rgba(163, 100, 255, 0.3))'
          }}>🎓</div>
          <h1 className="text-gradient-lavender" style={{ 
            margin: 0, 
            fontWeight: '900', 
            fontSize: '2.2rem',
            letterSpacing: '-0.03em'
          }}>
            Studnsta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem', fontWeight: '500' }}>
            Elevate your learning experience
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glow-button"
            style={{ 
              width: '100%', 
              marginBottom: '1.5rem',
              fontSize: '1.1rem'
            }}
          >
            {isLoading ? 'Unlocking Spark...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>New student? </span>
          <button 
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--rich-lilac)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '700'
            }}
          >
            Join the community
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;