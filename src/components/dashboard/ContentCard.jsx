import React from 'react';
import { motion } from 'framer-motion';

function ContentCard({ title, imageUrl, link }) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.a
      href={link}
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: "0px 15px 25px rgba(79, 70, 229, 0.3)" }}
      className="block w-[300px] flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-white/10"
    >
      <div className="w-full h-44 bg-gray-700">
        <img 
          src={imageUrl || `https://placehold.co/300x180/1f2937/4f46e5?text=${title.split(' ').join('+')}`} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/300x180/1f2937/ffffff?text=Image+Error`}}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{title}</h3>
      </div>
    </motion.a>
  );
}

export default ContentCard;
