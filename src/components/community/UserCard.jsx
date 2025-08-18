import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- COMPONENT ---
function UserCard({ user }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Link 
        to={`/user/${user.uid}`} 
        className="flex items-center bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg transition-all duration-300"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex justify-center items-center font-bold text-2xl text-white mr-5 overflow-hidden flex-shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.course}</p>
          <p className="text-xs text-gray-500 mt-1">{user.hometown}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default UserCard;
