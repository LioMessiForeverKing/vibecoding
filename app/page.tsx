'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Spotify-inspired background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-black opacity-50" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex justify-between items-center p-6"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2"
        >
          <ArrowRightCircle className="text-green-500 w-8 h-8" />
          <h1 className="text-2xl font-bold text-white">Meloraise</h1>
        </motion.div>
      </motion.header>
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-8 max-w-3xl"
        >
          Discover, Rank, and Connect Through Music
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl mb-12 max-w-2xl text-gray-300"
        >
          Showcase your music taste, challenge others, and climb the leaderboard
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 w-full max-w-md"
        >
          <Link href="/auth?view=sign_up" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-500 text-black py-3 px-6 rounded-full 
                        font-bold flex items-center justify-center space-x-2 
                        hover:bg-green-600 transition-colors"
            >
              <User className="mr-2" />
              Sign Up
            </motion.button>
          </Link>
          
          <Link href="/rankings" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full border-2 border-white py-3 px-6 rounded-full 
                        font-bold flex items-center justify-center space-x-2 
                        hover:bg-white hover:text-black transition-colors"
            >
              View Rankings
              <Trophy className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Swipe Button */}
        <Link href="/choose">
        <motion.button
         
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-transparent border-2 border-green-500 
                    text-green-500 py-3 px-6 rounded-full 
                    font-bold flex items-center justify-center 
                    hover:bg-green-500 hover:text-black transition-colors"
        >
          Start Swiping
        </motion.button>
        </Link>
      </main>
    </div>
  );
};

export default HomePage;
