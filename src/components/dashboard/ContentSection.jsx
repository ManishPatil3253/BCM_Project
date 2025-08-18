import React from 'react';
import ContentCard from './ContentCard';
import { motion } from 'framer-motion';

function ContentSection({ title, items = [] }) {
  const displayedItems = items.slice(0, 9);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-5 text-white border-l-4 border-indigo-500 pl-4">{title}</h2>
      <motion.div 
        className="flex gap-5 overflow-x-auto pb-4 -mx-10 px-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayedItems.length > 0 ? (
          displayedItems.map(item => (
            <ContentCard key={item.id} title={item.title} imageUrl={item.imageUrl} link={item.link || `/post/${item.id}`} />
          ))
        ) : (
          <p className="text-gray-500">No items to display in this section yet.</p>
        )}
      </motion.div>
    </section>
  );
}

export default ContentSection;
