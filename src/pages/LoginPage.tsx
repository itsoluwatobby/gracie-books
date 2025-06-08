/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
// import { GoogleLogin } from '@react-oauth/google';
// import Input from '../components/ui/Input';
import useAuthContext from '../context/useAuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { appName } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from URL params or default to homepage
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
    //   // const success = await login(email, password);
      
    //   if (success) {
    //     navigate(redirectTo);
    //   } else {
    //     setError('Invalid email or password');
    //   }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSuccess = async (credentialResponse: any) => {
  //   try {
  //     const success = await loginWithGoogle(credentialResponse.credential);
  //     if (success) {
  //       navigate(redirectTo);
  //     }
  //   } catch (error) {
  //     setError('Failed to login with Google');
  //     console.error(error);
  //   }
  // };

  // const handleGoogleError = () => {
  //   setError('Google login failed. Please try again.');
  // };

  /**
   * const {
  login,
  signup,
  PASSWORD_REGEX,
  EMAIL_REGEX,
} = useAuthStore();

const isValidEmail = computed(() => {
  if (props.isLogin) return true;
  if (user.value.email.length === 0) return;
  return EMAIL_REGEX.test(user.value.email);
});

const isPasswordValid = computed(() => {
  if (props.isLogin) return true;
  if (user.value.password.length === 0) return;
  return PASSWORD_REGEX.test(user.value.password);
});

const loading = ref(false);
const googleLoginLoading = ref(false);

const canSubmit = computed(() => {
  return [...Object.values(user.value)].every(Boolean);
});

const handlePolicy = () => acceptPolicy.value = !acceptPolicy.value;

const isRequirementMet = computed(() => {
  if (props.isLogin) return canSubmit.value;
  return canSubmit.value && isPasswordValid.value && isValidEmail.value && acceptPolicy.value;
});

const submit = async (signInMethod: SignInMethodTypes) => {
  if (
    loading.value || googleLoginLoading.value ||
    (!canSubmit.value && !isRequirementMet.value && signInMethod === "password")
  )
    return;

  try {
    let message = "Login Successful";
    const referralCode = query?.referralCode as string;

    if (props.isLogin) {
      if (signInMethod === "password") {
        loading.value = true;
        await login({
          signInMethod: "password",
          credentials: user.value,
          referralCode,
        });
      } else if (signInMethod === "google.com") {
        googleLoginLoading.value = true;
        await login({ signInMethod: "google.com", referralCode });
      } else {
        googleLoginLoading.value = true;
        await login({ signInMethod: "apple.com", referralCode });
      }
    } else {
      if (signInMethod === "password") {
        loading.value = true;
        await signup({
          signInMethod: "password",
          credentials: user.value,
          referralCode,
        });
        message = "Account created successfully!";
      } else {
        if (signInMethod === "google.com") {
          googleLoginLoading.value = true;
          await signup({ signInMethod: "google.com", referralCode });
          // message = 'Account created successfully!';
        } else {
          googleLoginLoading.value = true;
          await signup({ signInMethod: "apple.com", referralCode });
        }
      }
    }

    toast.success(message);
    router.push({ name: "agent-user-ai-search" });
    // router.push({ name: "agent-user-dashboard" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errCode = error.message;

    let message = "";
    if (!error?.response?.data) {
      if (errCode === "auth/invalid-email")
        message = "Please enter a valid email address";
      else if (errCode === "auth/user-not-found")
        message = "No account found with this email";
      else if (errCode === "auth/missing-email")
        message = "Please provide an email";
      else if (errCode === "auth/invalid-credential")
        message = "Bad credentials";
      else if (errCode === "auth/email-already-in-use")
        message = "Email already taken";
      else message = errCode || "Error! Try again";
    } else {
      message = error?.response?.data?.message || error.messge;
    }

    toast.error(message);
  } finally {
    loading.value = false;
    googleLoginLoading.value = false;
  }
}
   */

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
            
            <form onSubmit={handleSubmit}>
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
                type="submit"
                fullWidth
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

              {/* <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </div> */}
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-700 hover:text-blue-900 font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p className="mb-2">For demo purposes, you can use:</p>
              <div className="bg-gray-50 p-3 rounded-md inline-block text-left">
                <p><strong>Regular User:</strong> john@example.com</p>
                <p><strong>Admin User:</strong> admin@example.com</p>
                <p className="text-xs mt-1">(any password will work)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;