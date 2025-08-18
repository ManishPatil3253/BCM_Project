import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ImportantNoticeBanner({ notice, onClose }) {
  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-[72px] w-full bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 text-center z-[49] flex justify-center items-center shadow-lg"
        >
          <div className="container mx-auto flex justify-between items-center px-6">
            <span className="text-2xl mr-4">🚨</span>
            <div className="flex-grow text-left">
              <strong className="font-bold">{notice.title}:</strong> {notice.content}
            </div>
            <button className="text-2xl hover:opacity-75 transition-opacity" onClick={onClose} title="Dismiss">
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ImportantNoticeBanner;
