// import React from 'react';
// import { motion } from 'framer-motion';

// // --- COMPONENT ---
// function ChatbotIcon({ onClick }) {
//   return (
//     <motion.div
//       // Animate the icon to pulse and grab the user's attention
//       animate={{ scale: [1, 1.1, 1] }}
//       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//       whileHover={{ scale: 1.2, rotate: 20 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={onClick}
//       className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex justify-center items-center text-3xl shadow-2xl cursor-pointer z-[1000]"
//     >
//       <i className="fas fa-robot"></i>
//     </motion.div>
//   );
// }

// export default ChatbotIcon;

// import React from 'react';
// import { motion } from 'framer-motion';

// // --- COMPONENT ---
// function ChatbotIcon({ onClick }) {
//   return (
//     <motion.div
//       // Animate the icon to pulse and grab the user's attention
//       animate={{ scale: [1, 1.05, 1] }}
//       transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//       whileHover={{ scale: 1.15, rotate: 15 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex justify-center items-center text-3xl shadow-2xl cursor-pointer z-[1000]"
//       title="Chat with Hostel Helper"
//     >
//       {/* Friendly Bot SVG Icon */}
//       <svg 
//         xmlns="http://www.w3.org/2000/svg" 
//         viewBox="0 0 24 24" 
//         fill="currentColor" 
//         className="w-9 h-9"
//       >
//         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
//         <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm4.5 12.5c-1.5 0-2.75-1.25-2.75-2.75S14.5 11 16.5 11s2.75 1.25 2.75 2.75-1.25 2.75-2.75 2.75zm-9 0C6 16.5 4.75 15.25 4.75 13.75S6 11 7.5 11s2.75 1.25 2.75 2.75-1.25 2.75-2.75 2.75zm4.5-5c-.83 0-1.5-.67-1.5-1.5S11.17 9 12 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
//       </svg>
//     </motion.div>
//   );
// }

// export default ChatbotIcon;

import React from 'react';
import { motion } from 'framer-motion';

// --- COMPONENT ---
function ChatbotIcon({ onClick }) {
  return (
    <motion.div
      // Animate the icon to pulse and grab the user's attention
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.15, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex justify-center items-center text-3xl shadow-2xl cursor-pointer z-[1000]"
      title="Chat with Hostel Helper"
    >
      {/* Friendly Bot Helper SVG Icon with Headset */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-9 h-9"
      >
        <path d="M12 1a9 9 0 00-9 9v7c0 1.66 1.34 3 3 3h1v-4h-2v-3a7 7 0 017-7 7 7 0 017 7v3h-2v4h1c1.66 0 3-1.34 3-3v-7a9 9 0 00-9-9z"/>
        <circle cx="9" cy="12" r="1.5"/>
        <circle cx="15" cy="12" r="1.5"/>
      </svg>
    </motion.div>
  );
}

export default ChatbotIcon;
