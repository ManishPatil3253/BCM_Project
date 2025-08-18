import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { db } from './firebaseConfig';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';

// Import all our components
import Header from './components/Header.jsx';
import LoggedInHeader from './components/LoggedInHeader.jsx';
import Footer from './components/Footer.jsx';
import ImportantNoticeBanner from './components/ImportantNoticeBanner.jsx';
import ChatbotIcon from './components/chatbot/ChatbotIcon.jsx';
import ChatbotWindow from './components/chatbot/ChatbotWindow.jsx';

function App() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [importantNotice, setImportantNotice] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, "posts"),
      where("isImportant", "==", true),
      where("createdAt", ">=", threeDaysAgo),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        setImportantNotice(querySnapshot.docs[0].data());
        setShowBanner(true);
      } else {
        setImportantNotice(null);
        setShowBanner(false);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Define routes where the header/footer should be hidden or styled differently
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isHomePage = location.pathname === '/';

  const paddingTopClass = currentUser 
    ? (importantNotice && showBanner ? 'pt-32' : 'pt-20') // Logged in
    : (isHomePage ? 'pt-0' : 'pt-20'); // Public

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (currentUser ? <LoggedInHeader /> : <Header />)}
      
      {currentUser && importantNotice && showBanner && (
        <ImportantNoticeBanner notice={importantNotice} onClose={() => setShowBanner(false)} />
      )}
      
      <main className={`flex-grow ${paddingTopClass}`}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      
      {!isAuthPage && <Footer />}

      {currentUser && (
        <>
          <ChatbotIcon onClick={() => setIsChatOpen(true)} />
          <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
    </div>
  );
}

export default App;
