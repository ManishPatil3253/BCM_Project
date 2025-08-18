import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/community/UserCard';
import { motion } from 'framer-motion';

function FindSeniorsPage() {
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const usersQuery = query(
      collection(db, "users"),
      where("status", "==", "approved"),
      orderBy("name")
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const otherUsers = users.filter(user => user.uid !== currentUser.uid);
      setAllUsers(otherUsers);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
        <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-8">Loading Hostel Directory...</h1>
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
          transition={{ duration: 0.5 }}
        >
          Hostel Directory
        </motion.h1>

        {allUsers.length === 0 ? (
          <p className="text-gray-400">No other approved users have been found in the directory.</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allUsers.map(user => (
              <UserCard key={user.uid} user={user} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FindSeniorsPage;
