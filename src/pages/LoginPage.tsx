import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { userAuthenticationAPI } from '../composables/auth';
import toast from 'react-hot-toast';
import { userService } from '../services';
import { GoogleSignupbutton } from '../components/ui/GoogleSignupbutton';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { appName, setUser, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from URL params or default to homepage
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (signInMethod: SignInMethodTypes) => {
    setError('');
    setIsLoading(true);
    
    try {
      let res: Partial<UserInfo> | null = null;
      if (signInMethod === "password") {
        res = await userAuthenticationAPI.login(
          {
            signInMethod,
            credentials: { email, password },
          },
        );
      } else {
        res = await userAuthenticationAPI.login({ signInMethod });
      }
      const user = await userService.addUser(res);
      setUser(user);
      setIsAuthenticated(true);
      navigate(redirectTo);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errCode = err.message;

      let message = "";
      if (!err?.response?.data) {
        switch(errCode) {
          case "auth/invalid-email":
            message = "Please enter a valid email address";
            break;
          case "auth/user-not-found":
            message = "No account found with this email";
            break;
          case "auth/missing-email":
            message = "Please provide an email";
            break;
          case "auth/invalid-credential":
            message = "Bad credentials";
            break;
          case "auth/email-already-in-use":
            message = "Email already taken";
            break;
          case "auth/popup-closed-by-user":
            message = "An error occurred";
            break;
          default:
            message = errCode || "Error! Try again";
        } 
      } else {
        message = err?.response?.data?.message || err.messge;
      }

      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-900 py-4 px-6 flex items-center justify-center">
            <BookOpen className="text-white mr-2" size={24} />
            <h1 className="text-xl font-bold text-white">{appName.name}</h1>
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
              Login to Your Account
            </h2>
            
            <form>
              {error ? (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              ) : null}
              
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
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-700 hover:text-blue-900">
                    Forgot Password?
                  </Link>
                </div>
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
              </div>
              
              <Button
                type="button"
                fullWidth
                onClick={() => handleSubmit("password")}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Log In
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mb-6">
                <GoogleSignupbutton
                type='button'
                className='self-center w-40'
                onClick={() => handleSubmit("google.com")}
                />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-700 hover:text-blue-900 font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
            
            {/* <div className="mt-8 text-center text-sm text-gray-500">
              <p className="mb-2">For demo purposes, you can use:</p>
              <div className="bg-gray-50 p-3 rounded-md inline-block text-left">
                <p><strong>Regular UserInfo:</strong> john@example.com</p>
                <p><strong>Admin UserInfo:</strong> admin@example.com</p>
                <p className="text-xs mt-1">(any password will work)</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;