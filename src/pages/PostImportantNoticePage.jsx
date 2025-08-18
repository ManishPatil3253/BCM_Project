import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Reusing Auth components for a consistent form UI
const AuthFormContainer = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a092d] to-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8"
    >
      {children}
    </motion.div>
  </div>
);

const FormInput = (props) => (
  <input
    {...props}
    className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
  />
);

const FormTextarea = (props) => (
    <textarea
      {...props}
      className="w-full h-32 bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
    />
);

function PostImportantNoticePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!currentUser) {
      setError("You must be logged in to post.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const authorName = userDoc.exists() ? userDoc.data().name : "Admin";

      await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        category: 'important-notice',
        isImportant: true,
        authorId: currentUser.uid,
        authorName: authorName,
        createdAt: serverTimestamp(),
        status: 'approved',
      });
      navigate('/notice-board');
    } catch (err) {
      setError('Failed to post notice. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer>
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Post an Important Notice</h2>
      <p className="text-gray-400 mb-6 text-center">This notice will be published immediately and shown as a banner.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="text"
          placeholder="Notice Title (max 100 characters)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength="100"
          required
        />
        <FormTextarea
          placeholder="Notice Content (max 500 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength="500"
          required
        />
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-4 font-bold text-white bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-lg hover:shadow-red-500/50 transition-shadow disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Important Notice'}
        </motion.button>
      </form>
    </AuthFormContainer>
  );
}

export default PostImportantNoticePage;
