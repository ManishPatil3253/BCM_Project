import React from 'react';
import { motion } from 'framer-motion';

// --- COMPONENT ---
function SuggestionPills({ suggestions, onPillClick }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 self-start">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPillClick(suggestion)}
          className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 rounded-full px-3 py-1 text-xs cursor-pointer transition-colors"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}

export default SuggestionPills;
