import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">WebWizards Blog</h3>
            <p className="text-gray-400 mt-2">Share your thoughts with the world</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://github.com/ArdiSyla" target='blank' className="hover:text-indigo-400 transition-colors">
              <Github className="w-5 h-5" /> 
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ardi-syla/" target='blank' className="hover:text-indigo-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Ardi Syla. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;