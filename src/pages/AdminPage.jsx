import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Reusable Table Component for Admin Page
const ApprovalTable = ({ title, headers, data, onApprove, onReject, dataFields }) => {
  return (
    <motion.section 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="bg-gray-800/50 border border-white/10 rounded-xl shadow-lg overflow-hidden">
        {data.length === 0 ? (
          <p className="p-6 text-gray-400">No pending items found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-900/50">
              <tr>
                {headers.map(header => (
                  <th key={header} className="p-4 font-semibold text-gray-300 uppercase text-sm">{header}</th>
                ))}
                <th className="p-4 font-semibold text-gray-300 uppercase text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-t border-white/10 hover:bg-gray-700/50 transition-colors">
                  {dataFields.map(field => (
                    <td key={field} className="p-4 text-gray-300">{item[field]}</td>
                  ))}
                  <td className="p-4 text-right">
                    <button 
                      className="px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-md mr-2 hover:bg-green-700 transition-colors"
                      onClick={() => onApprove(item.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="px-4 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                      onClick={() => onReject(item.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.section>
  );
};


function AdminPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersQuery = query(collection(db, "users"), where("status", "==", "pending"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setPendingUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), where("status", "==", "pending"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      setPendingPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribePosts();
  }, []);

  const handleApproveUser = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status: "approved" });
  };

  const handleRejectUser = async (userId) => {
    // Note: window.confirm is generally discouraged in modern UI. 
    // A custom modal would be a better UX, but for keeping logic the same, we'll keep it.
    if (window.confirm("Are you sure you want to reject this user? Their data will be deleted.")) {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
    }
  };
  
  const handleApprovePost = async (postId) => {
    const postDocRef = doc(db, "posts", postId);
    await updateDoc(postDocRef, { status: "approved" });
  };
  
  const handleRejectPost = async (postId) => {
    if (window.confirm("Are you sure you want to reject and delete this post?")) {
      const postDocRef = doc(db, "posts", postId);
      await deleteDoc(postDocRef);
    }
  };

  if (loading && pendingUsers.length === 0 && pendingPosts.length === 0) {
    return (
        <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-8">Loading Approvals...</h1>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        <ApprovalTable
          title="Pending Student Approvals"
          headers={["Name", "Email"]}
          data={pendingUsers}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          dataFields={["name", "email"]}
        />

        <ApprovalTable
          title="Pending Post Approvals"
          headers={["Title", "Author", "Category"]}
          data={pendingPosts}
          onApprove={handleApprovePost}
          onReject={handleRejectPost}
          dataFields={["title", "authorName", "category"]}
        />
      </div>
    </div>
  );
}

export default AdminPage;
