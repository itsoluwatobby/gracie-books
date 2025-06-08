/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err: any) {
      console.log(err.message);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   *  const { resetPassword, EMAIL_REGEX } = useAuthStore()
   *  const loading = ref(false);

  const resetEmail = ref("");

  const canSubmit = computed(() => Boolean(resetEmail.value));

  const isValidEmail = computed(() => {
    if (resetEmail.value.length === 0) return true;
    return EMAIL_REGEX.test(resetEmail.value);
  });

  const isRequirementMet = computed(() => {
    return canSubmit.value && isValidEmail.value;
  });

  onMounted(() => {
    setTimeout(() => {
      localStorage.removeItem('reset_password_data');
    }, 100);
  });

  const submit = async () => {
    if (loading.value || !isRequirementMet.value) return;

    try {
      loading.value = true;

      const response = await resetPassword(resetEmail.value);

      if (response === 'duplicate') {
        toast.success('Password reset link already sent to your email');
      } else {
        toast.success('Check your email for a password reset link');
      }
      // router.push({ name: 'enter-otp' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errCode = error.code ?? error.message;

      let message = '';
      if (errCode === 'auth/invalid-email') message = 'Please enter a valid email address';
      else if (errCode === 'auth/user-not-found') message = 'No account found with this email';
      else if (errCode === 'auth/missing-email') message = 'Please provide an email';
      else message = errCode ?? 'Error! Try again';

      toast.error(message);
    } finally {
      localStorage.removeItem('reset_password_data');
      loading.value = false;
    }
  }
   */

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to {email}. The link will expire in 1 hour.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <Link to="/login" className="text-blue-700 hover:text-blue-900 inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Reset your password
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
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

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;