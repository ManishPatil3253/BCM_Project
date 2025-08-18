import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ContentSection from '../components/dashboard/ContentSection';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';

function DashboardPage() {
  const { userData } = useAuth();
  
  const [textbooks, setTextbooks] = useState([]);
  const [competitive, setCompetitive] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categories = {
      setTextbooks: 'textbook',
      setCompetitive: 'competitive-material',
      setPlacements: 'opportunity',
      setStories: 'success-story',
    };

    const unsubscribes = Object.entries(categories).map(([setter, categoryName]) => {
      const q = query(
        collection(db, "posts"),
        where('category', '==', categoryName),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(9)
      );

      return onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        eval(`${setter}(items)`);
      });
    });
    
    setLoading(false);

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);


  if (!userData || loading) {
    return (
        <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-8">Loading Dashboard...</h1>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white">Welcome, {userData.name.split(' ')[0]}!</h1>
            <p className="text-gray-400 mt-1">Here's what's new in the community.</p>
          </div>
          <Link to="/create-post" className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition-transform">
            + Create a Post
          </Link>
        </motion.div>
        
        <div className="space-y-12">
          <ContentSection title="Latest Textbooks" items={textbooks} />
          <ContentSection title="Competitive Exam Corner" items={competitive} />
          <ContentSection title="New Opportunities" items={placements} />
          <ContentSection title="Recent Success Stories" items={stories} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
