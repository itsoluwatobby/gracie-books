/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Email already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      setError('Failed to sign up with Google');
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign up failed. Please try again.');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-900 py-4 px-6 flex items-center justify-center">
            <BookOpen className="text-white mr-2" size={24} />
            <h1 className="text-xl font-bold text-white">BookHaven</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <Link to="/login" className="text-blue-700 hover:text-blue-900 inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
              Create Your Account
            </h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="********"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="********"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-blue-700 hover:text-blue-900">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-700 hover:text-blue-900">
                  Privacy Policy
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;