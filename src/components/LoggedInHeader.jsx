import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Logo Component
const Logo = () => (
  <Link to="/dashboard" className="flex items-center text-xl font-bold text-white tracking-wider group">
    {/* Graduation Cap Icon */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-7 h-7 mr-2 text-indigo-400 group-hover:text-indigo-300 transition-colors"
    >
      <path d="M12 2L1 7.5V15.5L12 22L23 15.5V7.5L12 2ZM12 4.32L19.91 9L12 13.68L4.09 9L12 4.32ZM12 15.17L21 10.09V14.5L12 19.83L3 14.5V10.09L12 15.17Z" />
    </svg>
    <span>
      BCM<span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">2259</span>
    </span>
  </Link>
);

// SVG Icon for the menu (hamburger)
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

// SVG Icon for the close button (X)
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


function LoggedInHeader() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors";
  const activeLinkClass = "bg-gray-900 text-white";
  const mobileNavLinkClass = "block px-4 py-2 text-base text-gray-300 rounded-md hover:bg-gray-700 hover:text-white";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-lg z-50 border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/notice-board" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Notice Board</NavLink>
                <NavLink to="/events" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Events</NavLink>
                <NavLink to="/batchmates" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Batchmates</NavLink>
                <NavLink to="/find-seniors" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Seniors</NavLink>
                <NavLink to="/help" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Help</NavLink>
                <NavLink to="/opportunities" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Opportunities</NavLink>
                <NavLink to="/study-materials" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Study Materials</NavLink>
                <NavLink to="/success-stories" className={({isActive}) => isActive ? `${navLinkClass} ${activeLinkClass}` : navLinkClass}>Success Stories</NavLink>
              </div>
            </nav>
          </div>
          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white overflow-hidden ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-400"
              >
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}</span>
                )}
              </button>
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-800/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10"><p className="text-sm text-gray-400">Signed in as</p><p className="font-medium text-white truncate">{userData?.name || 'User'}</p></div>
                      <div className="py-1"><Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md">Your Profile</Link>{userData?.role === 'admin' && (<Link to="/admin" onClick={() => setIsProfileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md">Admin Panel</Link>)}</div>
                      <div className="py-1 border-t border-white/10"><button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md">Logout</button></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white text-2xl">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/notice-board" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Notice Board</NavLink>
              <NavLink to="/events" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Events</NavLink>
              <NavLink to="/batchmates" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Batchmates</NavLink>
              <NavLink to="/find-seniors" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Seniors</NavLink>
              <NavLink to="/help" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Help</NavLink>
              <NavLink to="/opportunities" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Opportunities</NavLink>
              <NavLink to="/study-materials" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Study Materials</NavLink>
              <NavLink to="/success-stories" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Success Stories</NavLink>
              <div className="border-t border-white/10 pt-4 mt-4">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-2 text-base text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
                    <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white overflow-hidden">
                        {userData?.photoURL ? <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <span>{userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}</span>}
                    </div>
                    Your Profile
                </Link>
                {userData?.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass}>Admin Panel</Link>}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base text-red-400 rounded-md hover:bg-red-500/20">Logout</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default LoggedInHeader;
