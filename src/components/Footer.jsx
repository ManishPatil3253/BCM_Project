import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900/50 border-t border-white/10 text-center p-6 mt-20">
      <p className="text-gray-400 text-sm">&copy; {currentYear > 2025 ? `2025 - ${currentYear}` : '2025'} BCM 2259. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
