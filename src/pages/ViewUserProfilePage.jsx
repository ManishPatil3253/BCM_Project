import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

function ViewUserProfilePage() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Failed to load user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="pt-24 pb-12 min-h-screen bg-gray-100 text-center"><h2 className="text-2xl">Loading Profile...</h2></div>;
  }

  if (error) {
    return <div className="pt-24 pb-12 min-h-screen bg-gray-100 text-center"><h2 className="text-red-500 text-2xl">{error}</h2></div>;
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-100">
      {userProfile && (
        <motion.div 
          className="container mx-auto px-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col sm:flex-row items-center mb-6 pb-6 border-b border-gray-200">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-500 text-white flex items-center justify-center text-5xl font-bold mr-0 sm:mr-8 mb-4 sm:mb-0 flex-shrink-0 overflow-hidden">
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">{userProfile.name}</h1>
                <p className="text-gray-600 text-center sm:text-left">{userProfile.course} - {userProfile.year}</p>
              </div>
            </div>
            
            <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">About</h3>
                <p className="text-gray-800">{userProfile.bio || 'No bio provided.'}</p>
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Details</h3>
                <p className="text-gray-800"><strong className="font-semibold">College:</strong> {userProfile.college}</p>
                <p className="text-gray-800"><strong className="font-semibold">Hometown:</strong> {userProfile.hometown}</p>
                <p className="text-gray-800"><strong className="font-semibold">Working At:</strong> {userProfile.workingAt || 'Not specified'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ViewUserProfilePage;
