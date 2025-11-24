import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          
          {/* Left - Copyright */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">© {currentYear}</span>
            <span className="text-white font-medium">NGO Accounts</span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:inline text-gray-500">MRCD</span>
          </div>

          {/* Center - Powered By */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Powered by</span>
            <a 
              href="https://sltouchit.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 font-semibold transition-colors"
            >
              SL Touch IT Solutions
            </a>
          </div>

          {/* Right - Developer */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Developed by</span>
            <a 
              href="mailto:anayak2u@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Anoop
            </a>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;