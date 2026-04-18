import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [viewState, setViewState] = useState('login'); // 'login', 'forgot', 'reset'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate('/farmer-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        phoneNumber: formData.identifier,
        password: formData.password
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgotpassword', {
        phoneNumber: formData.identifier
      });

      if (response.data.success) {
        setMessage('Reset code sent! Check your phone for the 6-digit OTP.');
        setViewState('reset');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put('http://localhost:3001/api/auth/resetpassword', {
        otp: formData.otp,
        password: formData.newPassword
      });

      if (response.data.success) {
        // Automatically log them in with the token from reset
        login(response.data.user, response.data.token);
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-[400px] space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
            <Icon name="Leaf" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {viewState === 'login' ? 'Welcome back' : viewState === 'forgot' ? 'Reset Password' : 'Create New Password'}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {viewState === 'login' ? 'Enter your credentials to access your account' : 
             viewState === 'forgot' ? 'Enter your phone number to receive a recovery code' : 
             'Enter the 6-digit OTP code sent to your phone'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {message}
            </div>
          )}
          
          {viewState === 'login' && (
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
            
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-medium text-foreground">
                Phone Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="User" size={18} />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="e.g. 0771234567"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <button type="button" onClick={() => { setViewState('forgot'); setError(null); setMessage(null); }} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="Lock" size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          )}

          {viewState === 'forgot' && (
            <form className="space-y-5" onSubmit={handleForgotSubmit}>
              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Icon name="Phone" size={18} />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g. 0771234567"
                    value={formData.identifier}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
              >
                {isLoading ? <Icon name="Loader2" size={20} className="animate-spin" /> : 'Send Recovery Code'}
              </button>

              <button
                type="button"
                onClick={() => { setViewState('login'); setError(null); setMessage(null); }}
                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-semibold text-foreground bg-white hover:bg-muted focus:outline-none transition-all"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {viewState === 'reset' && (
            <form className="space-y-5" onSubmit={handleResetSubmit}>
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Icon name="Key" size={18} />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="123456"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Icon name="Lock" size={18} />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-foreground">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Icon name="Lock" size={18} />
                  </div>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
              >
                {isLoading ? <Icon name="Loader2" size={20} className="animate-spin" /> : 'Confirm New Password'}
              </button>

              <button
                type="button"
                onClick={() => { setViewState('login'); setError(null); setMessage(null); }}
                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-semibold text-foreground bg-white hover:bg-muted focus:outline-none transition-all"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;