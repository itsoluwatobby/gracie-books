/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, UserIcon, ArrowLeft } from 'lucide-react';
// import { GoogleLogin } from '@react-oauth/google';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { Passwords } from '../components/ui/Password';
import { userAuthenticationAPI } from '../composables/auth';
import toast from 'react-hot-toast';
import { userService } from '../services';
import { GoogleSignupbutton } from '../components/ui/GoogleSignupbutton';

const initDetails = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const SignUpPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState(initDetails);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { appName, setUser, setIsAuthenticated } = useAuthContext();

  const navigate = useNavigate();

  const { email, password, confirmPassword, fullName } = userDetails;

    // useEffect(() => {
    //   if (email.length === 0) return;
    //   const isValidEmail = () => {
    //     if (props.isLogin) return true;
    //     return EMAIL_REGEX.test(user.value.email);
    //   }
    // }, [email])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [name, value] = [e.target.name, e.target.value];
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  // const validateForm = () => {
  //   if (!fullName || !email || !password || !confirmPassword) {
  //     setError('All fields are required');
  //     return false;
  //   }

  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match');
  //     return false;
  //   }

  //   if (password.length < 8) {
  //     setError('Password must be at least 8 characters long');
  //     return false;
  //   }

  //   return true;
  // };

  // const handleSubmit = async (e: React.FormEvent, signInMethod: SignInMethodTypes) => {
  const handleSubmit = async (signInMethod: SignInMethodTypes) => {
    setError('');

    // if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let user: Partial<UserInfo> | null = null;
      if (signInMethod === "password") {
        user = await userAuthenticationAPI.signup(
          {
            signInMethod,
            credentials: { email, password },
          },
        );
        console.log(user)
        const res = await userService.addUser({ ...user, fullName });
        console.log({ res })
        setUserDetails(initDetails);
      } else {
        user = await userAuthenticationAPI.signup({ signInMethod });
        await userService.addUser(user);
      }
      setUser(user);
      setIsAuthenticated(true);
      navigate('/');
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
          
          <div className="p-6 flex flex-col">
            <div className="mb-6">
              <Link to="/login" className="text-blue-700 hover:text-blue-900 inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
              Create Your Account
            </h2>
            
            <form className='flex flex-col gap-y-4'>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Passwords 
                  name="password"
                  handleChange={handleChange}
                  pwd={password}
                  label='Password'
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              
              <Passwords 
                name="confirmPassword"
                handleChange={handleChange}
                pwd={confirmPassword}
                label='Confirm Password'
              />
              
              <Button
                type="button"
                fullWidth
                onClick={() => handleSubmit("password")}
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
                <GoogleSignupbutton
                type='button'
                className='self-center w-40'
                onClick={() => handleSubmit("google.com")}
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