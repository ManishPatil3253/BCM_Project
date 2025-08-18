import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';

// Reusable animated form container
const AuthFormContainer = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a092d] to-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 text-center"
    >
      {children}
    </motion.div>
  </div>
);

// Reusable animated input field
const AuthInput = (props) => (
  <input
    {...props}
    className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  />
);

// Reusable animated button
const AuthButton = ({ children, disabled }) => (
  <motion.button
    type="submit"
    disabled={disabled}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full py-3 mt-4 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </motion.button>
);

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your inbox for password reset instructions.');
    } catch (err) {
      setError('Failed to send reset email. Please check if the email address is correct.');
      console.error("Error sending password reset email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer>
      <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
      <p className="text-gray-400 mb-6">Enter your email to get a reset link.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <AuthInput
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <p className="text-green-400 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <AuthButton disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </AuthButton>
      </form>

      <div className="mt-6">
        <Link to="/login" className="text-sm text-indigo-400 hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthFormContainer>
  );
}

export default ForgotPasswordPage;
