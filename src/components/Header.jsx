import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Logo Component
const Logo = () => (
  <Link to="/" className="flex items-center text-2xl font-bold text-white tracking-wider group">
    {/* Graduation Cap Icon */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-8 h-8 mr-2 text-violet-400 group-hover:text-violet-300 transition-colors"
    >
      <path d="M12 2L1 7.5V15.5L12 22L23 15.5V7.5L12 2ZM12 4.32L19.91 9L12 13.68L4.09 9L12 4.32ZM12 15.17L21 10.09V14.5L12 19.83L3 14.5V10.09L12 15.17Z" />
    </svg>
    <span>
      BCM<span className="text-violet-400 group-hover:text-violet-300 transition-colors">2259</span>
    </span>
  </Link>
);


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#a78bfa' : '#e5e7eb',
    position: 'relative',
  });

  const NavLinkUnderline = () => (
    <motion.div
      className="absolute bottom-[-4px] left-0 h-[2px] w-full bg-violet-400"
      layoutId="underline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );

  // SVG Icon for the menu (hamburger)
  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );

  // SVG Icon for the close button (X)
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full bg-black/20 backdrop-blur-lg z-50"
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          <NavLink to="/about" style={navLinkStyles}>
            {({ isActive }) => ( <> About {isActive && <NavLinkUnderline />} </> )}
          </NavLink>
          <a href="https://maps.app.goo.gl/wu9DNq1Kvd4Gevb18" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors relative">
            Location
          </a>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-gray-900 bg-violet-400 rounded-full hover:bg-violet-500 transition-colors">
              SignUp
            </Link>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/30"
          >
            <div className="px-6 pt-2 pb-4 space-y-2">
              <NavLink to="/about" className="block text-white py-2" onClick={() => setIsMenuOpen(false)}>About</NavLink>
              <a href="https://maps.app.goo.gl/wu9DNq1Kvd4Gevb18" target="_blank" rel="noopener noreferrer" className="block text-white py-2">Location</a>
              <div className="border-t border-white/20 pt-4 flex flex-col space-y-3">
                <Link to="/login" className="text-center w-full px-5 py-2 font-semibold text-white bg-white/10 rounded-full" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="text-center w-full px-5 py-2 font-semibold text-gray-900 bg-violet-400 rounded-full" onClick={() => setIsMenuOpen(false)}>
                  SignUp
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
