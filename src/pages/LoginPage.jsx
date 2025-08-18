import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Reusing the components from ForgotPasswordPage for consistency
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

const AuthInput = (props) => (
  <input
    {...props}
    className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  />
);

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


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().status === 'approved') {
        navigate('/dashboard');
      } else {
        setError('Your account is pending approval or does not exist.');
        await signOut(auth);
      }
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer>
      <h2 className="text-3xl font-bold text-white mb-2">Student Login</h2>
      <p className="text-gray-400 mb-6">Welcome back to the community.</p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <AuthInput
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        
        <AuthButton disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </AuthButton>
      </form>

      <div className="mt-6 text-sm">
        <Link to="/forgot-password" className="text-indigo-400 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </AuthFormContainer>
  );
}

export default LoginPage;
