import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// A dedicated card component for notices
const NoticeCard = ({ notice, isAdmin, onDelete }) => {
  const stripHtml = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent || "";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-gray-800/50 border-l-4 p-6 rounded-xl shadow-lg ${notice.isImportant ? 'border-red-500' : 'border-indigo-500'}`}
    >
      {isAdmin && (
        <button 
          onClick={() => onDelete(notice.id)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-xl"
          title="Delete Notice"
        >
          &times;
        </button>
      )}
      <Link to={`/post/${notice.id}`}>
        <h2 className="text-xl font-bold text-white mb-2 hover:text-indigo-400 transition-colors pr-8">{notice.title}</h2>
        <p className="text-xs text-gray-400 mb-4">
          Posted on: {new Date(notice.createdAt?.toDate()).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm line-clamp-2">
          {stripHtml(notice.content)}
        </p>
      </Link>
    </motion.div>
  );
};

function NoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("category", "in", ["notice-board", "important-notice"]),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setNotices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteNotice = async (postId) => {
    if (window.confirm("Are you sure you want to permanently delete this notice?")) {
      await deleteDoc(doc(db, "posts", postId));
    }
  };

  if (loading) {
    return (
        <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-8">Loading Notices...</h1>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.h1 
          className="text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Notice Board
        </motion.h1>

        {notices.length === 0 ? (
          <p className="text-gray-400">There are no notices at the moment.</p>
        ) : (
          <div className="space-y-6">
            {notices.map(notice => (
              <NoticeCard 
                key={notice.id} 
                notice={notice} 
                isAdmin={userData?.role === 'admin'}
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeBoardPage;
