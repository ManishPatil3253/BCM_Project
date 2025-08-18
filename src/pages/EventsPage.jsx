import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// A dedicated card component for events
const EventCard = ({ event }) => {
  // A simple function to strip HTML for the preview
  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Link to={`/post/${event.id}`} className="block bg-gray-800/50 border border-white/10 p-6 rounded-xl shadow-lg h-full">
        <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>
        <p className="text-xs text-gray-400 mb-4">
          Posted by {event.authorName} on {new Date(event.createdAt?.toDate()).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm line-clamp-3">
          {stripHtml(event.content)}
        </p>
      </Link>
    </motion.div>
  );
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("category", "==", "event"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="pt-24 pb-12 min-h-screen container mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-8">Loading Events...</h1>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.h1 
          className="text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Community Events
        </motion.h1>

        {events.length === 0 ? (
          <p className="text-gray-400">There are no upcoming events at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
