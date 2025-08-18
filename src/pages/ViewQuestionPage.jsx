// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { db } from '../firebaseConfig';
// import { doc, getDoc, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, deleteDoc } from 'firebase/firestore';
// import { useAuth } from '../context/AuthContext';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css';

// // --- STYLES ---
// const pageStyles = {
//   padding: '100px 50px 40px',
//   backgroundColor: '#f9f9f9',
//   minHeight: '100vh',
// };
// const containerStyles = {
//   maxWidth: '800px',
//   margin: '0 auto',
// };
// const questionSectionStyles = {
//   backgroundColor: 'white',
//   padding: '30px',
//   borderRadius: '8px',
//   boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//   position: 'relative',
// };
// const answerSectionStyles = {
//   marginTop: '30px',
// };
// const answerCardStyles = {
//   backgroundColor: 'white',
//   padding: '20px',
//   borderRadius: '8px',
//   boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//   marginBottom: '15px',
//   position: 'relative',
// };
// const answerMetaStyles = {
//   fontSize: '14px',
//   color: '#888',
//   borderBottom: '1px solid #eee',
//   paddingBottom: '10px',
//   marginBottom: '10px',
// };
// const submitButtonStyles = {
//   display: 'inline-block',
//   padding: '12px 25px',
//   backgroundColor: '#28a745',
//   color: 'white',
//   textDecoration: 'none',
//   borderRadius: '5px',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   marginTop: '20px',
//   cursor: 'pointer',
//   border: 'none',
// };
// const deleteButtonStyles = {
//   position: 'absolute',
//   top: '20px',
//   right: '20px',
//   background: 'none',
//   border: 'none',
//   fontSize: '24px',
//   cursor: 'pointer',
//   color: '#dc3545',
//   padding: '5px',
//   lineHeight: '1',
// };

// // --- COMPONENT ---
// function ViewQuestionPage() {
//   const { questionId } = useParams();
//   const { userData } = useAuth();
//   const navigate = useNavigate();
//   const [question, setQuestion] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [newAnswerContent, setNewAnswerContent] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       const docRef = doc(db, "questions", questionId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setQuestion({ id: docSnap.id, ...docSnap.data() });
//       }
//       setLoading(false);
//     };
//     fetchQuestion();
//   }, [questionId]);

//   useEffect(() => {
//     const answersQuery = query(collection(db, "questions", questionId, "answers"), orderBy("createdAt", "asc"));
//     const unsubscribe = onSnapshot(answersQuery, (snapshot) => {
//       setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });
//     return () => unsubscribe();
//   }, [questionId]);
  
//   const handleAnswerSubmit = async (e) => {
//     e.preventDefault();
//     if (!newAnswerContent.trim() || !userData) return;
//     const answersColRef = collection(db, "questions", questionId, "answers");
//     await addDoc(answersColRef, {
//       content: newAnswerContent,
//       authorId: userData.uid,
//       authorName: userData.name,
//       createdAt: serverTimestamp(),
//     });
//     setNewAnswerContent('');
//   };

//   const handleDeleteQuestion = async () => {
//     if (window.confirm("Are you sure you want to delete this entire question? This cannot be undone.")) {
//       await deleteDoc(doc(db, "questions", questionId));
//       navigate('/help');
//     }
//   };

//   const handleDeleteAnswer = async (answerId) => {
//     if (window.confirm("Are you sure you want to delete this answer?")) {
//       await deleteDoc(doc(db, "questions", questionId, "answers", answerId));
//     }
//   };

//   if (loading) return <div style={pageStyles}><h2>Loading Question...</h2></div>;

//   return (
//     <div style={pageStyles}>
//       <div style={containerStyles}>
//         {question && (
//           <div style={questionSectionStyles}>
//             {userData?.role === 'admin' && (
//               <button onClick={handleDeleteQuestion} style={deleteButtonStyles} title="Delete Question">&times;</button>
//             )}
//             <h1>{question.title}</h1>
//             <p style={answerMetaStyles}>Asked by: {question.authorName}</p>
//             <div dangerouslySetInnerHTML={{ __html: question.content }} />
//           </div>
//         )}

//         <div style={answerSectionStyles}>
//           <h2>{answers.length} Answers</h2>
//           {answers.map(answer => (
//             <div key={answer.id} style={answerCardStyles}>
//               {userData?.role === 'admin' && (
//                 <button onClick={() => handleDeleteAnswer(answer.id)} style={deleteButtonStyles} title="Delete Answer">&times;</button>
//               )}
//               <p style={answerMetaStyles}>Answered by: {answer.authorName}</p>
//               <div dangerouslySetInnerHTML={{ __html: answer.content }} />
//             </div>
//           ))}
//         </div>
        
//         <div style={{...answerCardStyles, marginTop: '30px'}}>
//           <h3>Your Answer</h3>
//           <form onSubmit={handleAnswerSubmit}>
//             <SunEditor 
//               setContents={newAnswerContent}
//               onChange={setNewAnswerContent}
//               height="150"
//               setOptions={{ buttonList: [['bold', 'italic', 'underline'], ['link'], ['list']] }}
//             />
//             <button type="submit" style={submitButtonStyles}>Post Your Answer</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewQuestionPage;

// src/pages/ViewQuestionPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { motion } from 'framer-motion';

function ViewQuestionPage() {
  const { questionId } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      const docRef = doc(db, "questions", questionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestion({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const answersQuery = query(collection(db, "questions", questionId, "answers"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(answersQuery, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [questionId]);
  
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswerContent.trim() || !userData) return;
    const answersColRef = collection(db, "questions", questionId, "answers");
    await addDoc(answersColRef, {
      content: newAnswerContent,
      authorId: userData.uid,
      authorName: userData.name,
      createdAt: serverTimestamp(),
    });
    setNewAnswerContent('');
  };

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this entire question? This cannot be undone.")) {
      await deleteDoc(doc(db, "questions", questionId));
      navigate('/help');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      await deleteDoc(doc(db, "questions", questionId, "answers", answerId));
    }
  };

  if (loading) return <div className="pt-24 pb-12 min-h-screen text-center"><h2 className="text-white text-2xl">Loading Question...</h2></div>;

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        {question && (
          <motion.div 
            className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {userData?.role === 'admin' && (
              <button onClick={handleDeleteQuestion} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" title="Delete Question">&times;</button>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">{question.title}</h1>
            <p className="text-sm text-gray-400 border-b border-white/10 pb-4 mb-4">Asked by: {question.authorName}</p>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.content }} />
          </motion.div>
        )}

        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-white">{answers.length} Answers</h2>
          {answers.map(answer => (
            <motion.div 
              key={answer.id} 
              className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
               {userData?.role === 'admin' && (
                <button onClick={() => handleDeleteAnswer(answer.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" title="Delete Answer">&times;</button>
              )}
              <p className="text-sm text-gray-400 border-b border-white/10 pb-3 mb-3">Answered by: {answer.authorName}</p>
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: answer.content }} />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
            className="bg-gray-800/50 border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Your Answer</h3>
          <form onSubmit={handleAnswerSubmit}>
            <div className="sun-editor-custom">
                <SunEditor 
                setContents={newAnswerContent}
                onChange={setNewAnswerContent}
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
            <button type="submit" className="w-full py-3 mt-6 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">Post Your Answer</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ViewQuestionPage;