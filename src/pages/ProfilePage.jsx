import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';

// Reusable component for profile detail fields
const ProfileDetail = ({ label, value, isEditing, name, onChange }) => (
  <div className="mb-4">
    <label className="text-xs font-bold text-gray-400 uppercase">{label}</label>
    {isEditing ? (
      <input 
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full bg-gray-700/50 border-b-2 border-white/20 p-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    ) : (
      <p className="text-white text-lg">{value || 'Not specified'}</p>
    )}
  </div>
);


function ProfilePage() {
  const { currentUser, userData, refreshUserData } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(userData?.photoURL);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setProfilePicUrl(userData?.photoURL);
  }, [userData]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "posts"),
      where("authorId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMyPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingPosts(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleEditToggle = () => {
    if (!isEditMode) {
      setEditData(userData);
      setProfilePicUrl(userData.photoURL);
      setProfilePicFile(null);
    }
    setIsEditMode(!isEditMode);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setUploading(true);

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      let newPhotoURL = userData.photoURL || null;

      if (profilePicFile) {
        const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
        await uploadBytes(storageRef, profilePicFile);
        newPhotoURL = await getDownloadURL(storageRef);
        await updateProfile(currentUser, { photoURL: newPhotoURL });
      }

      const dataToSave = { ...editData, photoURL: newPhotoURL };
      await updateDoc(userDocRef, dataToSave);
      await refreshUserData(currentUser);
      
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setIsEditMode(false);
      setUploading(false);
      setProfilePicFile(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'pending') return 'bg-yellow-500/20 text-yellow-400';
    if (status === 'approved') return 'bg-green-500/20 text-green-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  if (!userData) return <div className="pt-24 pb-12 min-h-screen"><h2 className="text-white text-2xl text-center">Loading Profile...</h2></div>;

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 text-center sticky top-24">
              <div 
                className="relative w-36 h-36 mx-auto rounded-full mb-4 cursor-pointer group"
                onClick={() => isEditMode && fileInputRef.current.click()}
              >
                <img 
                  src={profilePicUrl || `https://ui-avatars.com/api/?name=${userData.name}&background=4f46e5&color=fff&size=144`} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full ring-4 ring-indigo-500/50"
                />
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Change
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-indigo-400">{userData.course}</p>
              
              {!isEditMode ? (
                <button onClick={handleEditToggle} className="mt-6 w-full py-2 font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Edit Profile</button>
              ) : (
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSave} disabled={uploading} className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">{uploading ? 'Saving...' : 'Save'}</button>
                  <button onClick={handleEditToggle} className="w-full py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">About</h3>
              {isEditMode ? (
                <textarea name="bio" value={editData.bio || ''} onChange={handleChange} className="w-full h-24 bg-gray-700/50 border-b-2 border-white/20 p-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Tell us about yourself..."></textarea>
              ) : (
                <p className="text-gray-300">{userData.bio || 'No bio provided. Click "Edit Profile" to add one!'}</p>
              )}
            </div>

            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <ProfileDetail label="Email" value={userData.email} />
                    <ProfileDetail label="Phone" value={editData.phone} isEditing={isEditMode} name="phone" onChange={handleChange} />
                    <ProfileDetail label="Hometown" value={editData.hometown} isEditing={isEditMode} name="hometown" onChange={handleChange} />
                    <ProfileDetail label="Working At" value={editData.workingAt} isEditing={isEditMode} name="workingAt" onChange={handleChange} />
                </div>
            </div>

            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">My Posts</h3>
              {loadingPosts ? <p className="text-gray-400">Loading your posts...</p> : myPosts.length === 0 ? <p className="text-gray-400">You haven't submitted any posts yet.</p> : (
                <div className="space-y-4">
                  {myPosts.map(post => (
                    <div key={post.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                      <span className="text-white">{post.title}</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(post.status)}`}>{post.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
