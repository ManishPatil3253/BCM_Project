import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/hero-background.jpg'; // Make sure you have this image in assets

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // This effect checks if a user is logged in.
  // If they are, it redirects them from the public homepage to their dashboard.
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Render nothing while redirecting
  if (currentUser) {
    return null;
  }

  return (
    <main className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        animate={{ scale: [1, 1.05, 1], transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' } }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <motion.div 
        className="relative z-20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 text-shadow-lg">
          BCM Hostel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">2259</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Your digital home away from home. Connect, collaborate, and grow with your community.
        </p>
        <div className="flex gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="px-8 py-3 font-semibold text-white bg-white/10 rounded-full backdrop-blur-sm border border-white/20 transition-colors hover:bg-white/20">
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/signup" className="px-8 py-3 font-semibold text-gray-900 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full shadow-lg hover:shadow-violet-400/40 transition-shadow">
              SignUp
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default HomePage;
