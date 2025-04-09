import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css'; // Added login.css import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();
  
  // Add body class for styling
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return; // Add validation feedback if needed
    }
    
    try {
      console.log('Attempting login with:', { email });
      const userData = await login(email, password);
      console.log('Login successful:', userData);
      
      // Redirect based on role
      if (userData.role === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (userData.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already set in the AuthContext
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (user) {
    // If already logged in, redirect based on role
    if (user.role === 'faculty') {
      return <Navigate to="/faculty-dashboard" />;
    } else if (user.role === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-container">
          <div className="auth-logo">CC</div>
        </div>
        <h1 className="auth-title">Campus Connect</h1>
        <h2 className="auth-subtitle">Sign in to your account</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">@</span>
              <input
                id="email"
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>
          
          <div className="auth-remember">
            <div className="auth-checkbox-wrapper">
              <input type="checkbox" id="remember" className="auth-checkbox" />
            </div>
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <button
            type="submit"
            className={`auth-button ${loading ? 'auth-button-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
