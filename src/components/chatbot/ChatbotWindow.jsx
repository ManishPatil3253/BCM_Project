import React, { useState, useRef, useEffect } from 'react';
import { getResponse } from '../../services/chatbotLogic';
import SuggestionPills from './SuggestionPills';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENT ---
function ChatbotWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [currentPills, setCurrentPills] = useState([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initializeChat = async () => {
        const initialResponse = await getResponse('initial');
        setMessages([{ from: 'bot', text: initialResponse.response }]);
        setCurrentPills(initialResponse.pills);
      };
      initializeChat();
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    const userMessage = { from: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setCurrentPills([]);

    // Add a slight delay for a more natural feel
    setTimeout(async () => {
        const botResponse = await getResponse(text);
        const botMessage = { from: 'bot', text: botResponse.response };
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentPills(botResponse.pills);
    }, 500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-28 right-8 w-[360px] h-[550px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col z-[1000] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex justify-between items-center shadow-lg">
            <h3 className="font-bold text-lg">Hostel Helper</h3>
            <button className="text-2xl hover:opacity-80 transition-opacity" onClick={onClose}>&times;</button>
          </div>
          
          {/* Messages Container */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-3">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.from === 'bot' 
                    ? 'bg-gray-700/50 text-gray-200 self-start rounded-bl-none' 
                    : 'bg-indigo-500 text-white self-end rounded-br-none'
                  }`}
                >
                  <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: msg.text }} />
                </motion.div>
              ))}
            </AnimatePresence>
            <SuggestionPills suggestions={currentPills} onPillClick={handleSendMessage} />
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="p-3 border-t border-white/20 flex items-center gap-2" onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="flex-grow bg-gray-800/50 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Type or click an option..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatbotWindow;
