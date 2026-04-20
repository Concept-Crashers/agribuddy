import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    district: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = [
    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbarara', 'Gulu', 'Lira', 'Arua', 'Mbale', 'Masaka'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/register`, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        district: formData.district,
        password: formData.password,
        role: 'farmer'
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
            <Icon name="UserPlus" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Join AgriBuddy to manage your farm efficiently
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="User" size={18} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="Phone" size={18} />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="e.g. 0771234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="district" className="block text-sm font-medium text-foreground">
                District (For local weather alerts)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="MapPin" size={18} />
                </div>
                <select
                  id="district"
                  name="district"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.district}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select your district</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Icon name="Lock" size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUpPage;
