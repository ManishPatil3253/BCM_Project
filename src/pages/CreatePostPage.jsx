import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable component for the category selection cards
const CategoryCard = ({ to, icon, title, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -5, boxShadow: `0 10px 20px ${color}33` }}
  >
    <Link to={to} className={`block p-6 rounded-xl text-white font-bold text-center transition-all duration-300 ${color}`}>
      <span className="text-4xl block mb-3">{icon}</span>
      <span>{title}</span>
    </Link>
  </motion.div>
);

// Reusable component for the clickable div card
const ClickableCard = ({ onClick, icon, title, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -5, boxShadow: `0 10px 20px ${color}33` }}
    onClick={onClick}
    className={`block p-6 rounded-xl text-white font-bold text-center transition-all duration-300 cursor-pointer ${color}`}
  >
    <span className="text-4xl block mb-3">{icon}</span>
    <span>{title}</span>
  </motion.div>
);


function CreatePostPage() {
  const [showStudyOptions, setShowStudyOptions] = useState(false);
  const [dynamicCourses, setDynamicCourses] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const coursesSet = new Set();
      
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.course) {
          const courseKey = `study-${user.course.toLowerCase().replace(/ /g, '-')}`;
          const displayName = user.course;
          coursesSet.add(JSON.stringify({ name: displayName, category: courseKey }));
        }
      });
      
      setDynamicCourses(Array.from(coursesSet).map(item => JSON.parse(item)));
    };

    fetchCourses();
  }, []);

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.h1 
          className="text-4xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Create a New Post
        </motion.h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userData?.role === 'admin' && (
            <>
              <CategoryCard to="/post-important-notice" icon="🚨" title="Important Notice" color="bg-red-600 hover:bg-red-700" delay={0.1} />
              <CategoryCard to="/post-editor/notice-board" icon="📢" title="Notice" color="bg-amber-500 hover:bg-amber-600" delay={0.2} />
            </>
          )}
          <ClickableCard onClick={() => setShowStudyOptions(!showStudyOptions)} icon="📚" title="Study Material" color="bg-blue-500 hover:bg-blue-600" delay={0.3} />
          <CategoryCard to="/post-editor/opportunity" icon="💼" title="Opportunity" color="bg-green-500 hover:bg-green-600" delay={0.4} />
          <CategoryCard to="/post-editor/event" icon="🎉" title="Event" color="bg-purple-500 hover:bg-purple-600" delay={0.5} />
          <CategoryCard to="/post-editor/success-story" icon="🌟" title="Success Story" color="bg-yellow-500 hover:bg-yellow-600" delay={0.6} />
          <CategoryCard to="/post-editor/competitive-material" icon="🏆" title="Competitive Material" color="bg-teal-500 hover:bg-teal-600" delay={0.7} />
          <CategoryCard to="/post-editor/textbook" icon="📖" title="Textbook" color="bg-sky-500 hover:bg-sky-600" delay={0.8} />
        </div>

        <AnimatePresence>
          {showStudyOptions && (
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Select a Course for Study Material:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {dynamicCourses.length > 0 ? (
                  dynamicCourses.map((course, index) => (
                    <CategoryCard 
                      key={course.category} 
                      to={`/post-editor/${course.category}`} 
                      icon="📄" 
                      title={course.name} 
                      color="bg-gray-700 hover:bg-gray-600"
                      delay={index * 0.1}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full text-center">No courses found based on registered users.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreatePostPage;
