import React from 'react';
import { motion } from 'framer-motion';

// Reusable component for animated section headers
const SectionHeader = ({ children }) => (
  <motion.h2 
    className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.h2>
);

// Reusable component for feature cards
const FeatureCard = ({ icon, title, children, delay }) => (
  <motion.div 
    className="bg-gray-800/50 border border-white/10 rounded-xl p-6 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="text-4xl text-indigo-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </motion.div>
);


function AboutPage() {
  return (
    <motion.div 
      className="pt-24 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        {/* --- Hero Section --- */}
        <motion.section 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">BCM 2259</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Connecting students, fostering community, and providing the resources for success. Your digital home away from home.
          </p>
        </motion.section>

        {/* --- Our Mission Section --- */}
        <section className="mb-20">
          <SectionHeader>Our Mission</SectionHeader>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon="🤝" title="Connect" delay={0.1}>
              Easily find and connect with your batchmates and seniors, building a strong and supportive network from day one.
            </FeatureCard>
            <FeatureCard icon="📚" title="Collaborate" delay={0.2}>
              Share and access study materials, textbooks, and competitive exam resources uploaded by the community.
            </FeatureCard>
            <FeatureCard icon="🚀" title="Grow" delay={0.3}>
              Discover opportunities, celebrate success stories, and get help from peers on your academic and professional journey.
            </FeatureCard>
          </div>
        </section>

        {/* --- Why We Built This Section --- */}
        <section>
          <SectionHeader>Why We Built This</SectionHeader>
          <motion.div 
            className="max-w-4xl mx-auto bg-gray-800/30 p-8 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-300 text-lg text-center leading-relaxed">
              BCM 2259 was born from a simple idea: to make hostel life easier and more connected. We wanted to create a centralized platform where every student can find the information they need, from official notices to study notes for their specific course. This portal is designed to break down barriers, encourage collaboration, and ensure that every member of our community feels supported and empowered.
            </p>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}

export default AboutPage;
