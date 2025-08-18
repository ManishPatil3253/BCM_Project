// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css';
// import { useAuth } from '../context/AuthContext';
// import { db } from '../firebaseConfig';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { motion } from 'framer-motion';

// function PostEditor() {
//   const { category } = useParams();
//   const { userData } = useAuth();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // A function to format the category name for display
//   const formatCategoryName = (cat) => {
//     return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !content.trim()) {
//       setError('Title and content cannot be empty.');
//       return;
//     }
//     setLoading(true);
//     setError('');

//     try {
//       await addDoc(collection(db, "posts"), {
//         title: title,
//         content: content,
//         category: category,
//         authorId: userData.uid,
//         authorName: userData.name,
//         createdAt: serverTimestamp(),
//         status: 'pending',
//       });
//       // Redirect to a confirmation or dashboard page
//       navigate('/dashboard'); 
//     } catch (err) {
//       setError('Failed to submit post. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-24 pb-12 min-h-screen">
//       <motion.div 
//         className="container mx-auto px-6 max-w-4xl"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="bg-gray-800/50 border border-white/10 rounded-2xl shadow-2xl p-8">
//           <h1 className="text-3xl font-bold text-white mb-6">
//             Create New Post: <span className="text-indigo-400">{formatCategoryName(category)}</span>
//           </h1>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Enter your post title here..."
//               className="w-full bg-gray-900/50 border-b-2 border-white/20 p-4 text-2xl font-bold text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors mb-6"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
            
//             {/* Style the SunEditor to match the theme */}
//             <div className="sun-editor-custom">
//               <SunEditor 
//                 setContents={content}
//                 onChange={setContent}
//                 height="350"
//                 setOptions={{
//                   buttonList: [
//                     ['undo', 'redo'],
//                     ['font', 'fontSize', 'formatBlock'],
//                     ['bold', 'italic', 'underline', 'strike'],
//                     ['align', 'list', 'table'],
//                     ['link', 'image'],
//                     ['removeFormat']
//                   ]
//                 }}
//               />
//             </div>

//             {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            
//             <motion.button 
//               type="submit" 
//               disabled={loading}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full py-3 mt-6 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg hover:shadow-green-500/50 transition-shadow disabled:opacity-50"
//             >
//               {loading ? 'Submitting...' : 'Submit for Approval'}
//             </motion.button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default PostEditor;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

function PostEditor() {
  const { category } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // A function to format the category name for display
  const formatCategoryName = (cat) => {
    return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        category: category,
        authorId: userData.uid,
        authorName: userData.name,
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      // Redirect to a confirmation or dashboard page
      navigate('/dashboard'); 
    } catch (err) {
      setError('Failed to submit post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <motion.div 
        className="container mx-auto px-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-800/50 border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Create New Post: <span className="text-indigo-400">{formatCategoryName(category)}</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your post title here..."
              className="w-full bg-gray-900/50 border-b-2 border-white/20 p-4 text-2xl font-bold text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            {/* Style the SunEditor to match the theme */}
            <div className="sun-editor-custom">
              <SunEditor 
                setContents={content}
                onChange={setContent}
                height="350"
                setOptions={{
                  // --- RESTORED FULL TOOLBAR ---
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['align', 'list', 'table'],
                    ['link', 'image'],
                    ['removeFormat']
                  ]
                }}
              />
            </div>

            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            
            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg hover:shadow-green-500/50 transition-shadow disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default PostEditor;
