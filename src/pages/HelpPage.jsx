// import React, { useState, useEffect } from 'react';
// import { db } from '../firebaseConfig';
// import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import Modal from '../components/Modal.jsx';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css';

// // --- STYLES ---
// const pageStyles = {
//   padding: '100px 50px 40px',
//   backgroundColor: '#f9f9f9',
//   minHeight: '100vh',
// };
// const containerStyles = {
//   maxWidth: '900px',
//   margin: '0 auto',
// };
// const questionCardStyles = {
//   backgroundColor: 'white',
//   padding: '20px',
//   borderRadius: '8px',
//   boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//   marginBottom: '15px',
//   textDecoration: 'none',
//   color: 'inherit',
//   display: 'block',
// };
// const questionTitleStyles = {
//   margin: '0 0 10px 0',
//   fontSize: '1.3em',
// };
// const questionMetaStyles = {
//   fontSize: '14px',
//   color: '#888',
// };
// const askButtonStyles = {
//   display: 'inline-block',
//   padding: '12px 25px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   textDecoration: 'none',
//   borderRadius: '5px',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   marginBottom: '40px',
//   cursor: 'pointer',
//   border: 'none',
// };
// const inputStyles = {
//   width: '100%',
//   padding: '10px',
//   marginBottom: '20px',
//   border: '1px solid #ccc',
//   borderRadius: '4px',
//   fontSize: '1em',
//   boxSizing: 'border-box',
// };

// // --- COMPONENT ---
// function HelpPage() {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newQuestionTitle, setNewQuestionTitle] = useState('');
//   const [newQuestionContent, setNewQuestionContent] = useState('');
//   const { userData } = useAuth();

//   useEffect(() => {
//     const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       setQuestions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleAskQuestion = async (e) => {
//     e.preventDefault();
//     if (!newQuestionTitle.trim() || !userData) {
//       alert("Title cannot be empty.");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "questions"), {
//         title: newQuestionTitle,
//         content: newQuestionContent,
//         authorId: userData.uid,
//         authorName: userData.name,
//         createdAt: serverTimestamp(),
//       });

//       setNewQuestionTitle('');
//       setNewQuestionContent('');
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error posting question: ", error);
//       alert("Failed to post question.");
//     }
//   };

//   if (loading) {
//     return <div style={pageStyles}><h2>Loading Questions...</h2></div>;
//   }

//   return (
//     <div style={pageStyles}>
//       <div style={containerStyles}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h1>Help & Q/A</h1>
//           <button onClick={() => setIsModalOpen(true)} style={askButtonStyles}>Ask a Question</button>
//         </div>
        
//         {questions.length === 0 ? (
//           <p>No questions have been asked yet. Be the first!</p>
//         ) : (
//           <div>
//             {questions.map(question => (
//               <Link to={`/help/question/${question.id}`} key={question.id} style={questionCardStyles}>
//                 <h2 style={questionTitleStyles}>{question.title}</h2>
//                 <p style={questionMetaStyles}>
//                   Asked by: {question.authorName} on {new Date(question.createdAt?.toDate()).toLocaleDateString()}
//                 </p>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h2>Ask a New Question</h2>
//         <form onSubmit={handleAskQuestion}>
//           <input
//             type="text"
//             placeholder="What's your question? Be specific."
//             style={inputStyles}
//             value={newQuestionTitle}
//             onChange={(e) => setNewQuestionTitle(e.target.value)}
//             required
//           />
//           <SunEditor 
//             setContents={newQuestionContent}
//             onChange={setNewQuestionContent}
//             height="200"
//             setOptions={{
//               buttonList: [['bold', 'italic', 'underline'], ['link', 'image'], ['list']]
//             }}
//           />
//           <button type="submit" style={{...askButtonStyles, marginTop: '20px'}}>Post Question</button>
//         </form>
//       </Modal>
//     </div>
//   );
// }

// export default HelpPage;

// src/pages/HelpPage.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal.jsx';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { motion } from 'framer-motion';

function HelpPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !userData) {
      // A simple alert is fine inside a modal form
      alert("Title cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        title: newQuestionTitle,
        content: newQuestionContent,
        authorId: userData.uid,
        authorName: userData.name,
        createdAt: serverTimestamp(),
      });

      setNewQuestionTitle('');
      setNewQuestionContent('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting question: ", error);
      alert("Failed to post question.");
    }
  };

  if (loading) {
    return <div className="pt-24 pb-12 min-h-screen text-center"><h2 className="text-white text-2xl">Loading Questions...</h2></div>;
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white">Help & Q/A</h1>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition-transform">
            Ask a Question
          </button>
        </motion.div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-gray-400">No questions have been asked yet. Be the first!</p>
          ) : (
            questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
              >
                <Link to={`/help/question/${question.id}`} className="block bg-gray-800/50 border border-white/10 p-6 rounded-xl shadow-lg">
                  <h2 className="text-xl font-bold text-white mb-2">{question.title}</h2>
                  <p className="text-xs text-gray-400">
                    Asked by {question.authorName} on {new Date(question.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold text-white mb-6">Ask a New Question</h2>
        <form onSubmit={handleAskQuestion}>
          <input
            type="text"
            placeholder="What's your question? Be specific."
            className="w-full bg-gray-700/50 border-b-2 border-white/20 p-3 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors mb-4"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            required
          />
          <div className="sun-editor-custom">
            <SunEditor 
              setContents={newQuestionContent}
              onChange={setNewQuestionContent}
              height="200"
              setOptions={{
                // --- FULL TOOLBAR ADDED HERE ---
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
          <button type="submit" className="w-full py-3 mt-6 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">Post Question</button>
        </form>
      </Modal>
    </div>
  );
}

export default HelpPage;