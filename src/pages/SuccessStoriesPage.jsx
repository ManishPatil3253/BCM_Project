import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Card for success stories
const StoryCard = ({ story }) => {
  const stripHtml = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Link to={`/post/${story.id}`} className="block bg-gray-800/50 border border-white/10 p-6 rounded-xl shadow-lg h-full">
        <h2 className="text-xl font-bold text-white mb-2">{story.title}</h2>
        <p className="text-xs text-gray-400 mb-4">
          Shared by {story.authorName} on {new Date(story.createdAt?.toDate()).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm line-clamp-3">
          {stripHtml(story.content)}
        </p>
      </Link>
    </motion.div>
  );
};

function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("category", "==", "success-story"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setStories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Loading Success Stories...</h1>
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
          Success Stories
        </motion.h1>

        {stories.length === 0 ? (
          <p className="text-gray-400">No success stories have been shared yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessStoriesPage;
