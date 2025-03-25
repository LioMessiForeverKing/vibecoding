'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { Music, Headphones, Disc } from 'lucide-react';

export default function AuthPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // List of motivational quotes
  const quotes = [
    "\"Where words fail, music speaks.\" – Hans Christian Andersen",
    "\"Music is the universal language of mankind.\" - Henry Wadsworth Longfellow",
    "\"One good thing about music, when it hits you, you feel no pain.\" – Bob Marley",
    "\"Music can change the world because it can change people.\" - Bono",
    "\"Without music, life would be a mistake.\" – Friedrich Nietzsche",
  ];

  // Cycle through quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  // Animated icons for music theme
  const musicIcons = [Music, Headphones, Disc];

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google OAuth error:', err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-green-900 to-black opacity-60" />
      
      {/* Floating music notes background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 opacity-20"
            initial={{ 
              x: Math.random() * 100 - 50 + '%', 
              y: Math.random() * 100 + 100 + '%',
              rotate: Math.random() * 360,
              scale: 0.5 + Math.random() * 1.5
            }}
            animate={{ 
              y: [null, '-120%'],
              rotate: [null, Math.random() * 360 + 180],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20 + Math.random() * 30,
              ease: 'linear',
              delay: Math.random() * 10
            }}
          >
            {React.createElement(musicIcons[i % musicIcons.length], { size: 24 + Math.floor(Math.random() * 20) })}
          </motion.div>
        ))}
      </div>

      {/* Glass card container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-green-500 border-opacity-20"
        >
          {/* Logo/Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center mb-8"
          >
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Disc className="h-8 w-8 text-green-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">Meloraise</h1>
            </motion.div>
          </motion.div>

          {/* Animated Quotes */}
          <div className="relative h-20 mb-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-lg text-gray-300 italic text-center px-4">
                  {quotes[quoteIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sign in section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl text-center font-medium text-green-300 mb-6">Sign in to discover your musical matches</h2>
            
            {/* Google OAuth Button */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white text-gray-800 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-gray-100 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.72 1.23 9.25 3.25l6.9-6.9C36.2 2.3 30.4 0 24 0 14.8 0 7.05 5.4 3.4 13.3l7.9 6.2C13.4 13.1 18.3 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.6 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.7c-.6 3-2.4 5.5-5 7.2l7.8 6c4.6-4.2 7.1-10.4 7.1-17.7z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M10.3 28.5c-1.1-3.3-1.1-6.7 0-10l-7.9-6.2C.5 16.3 0 20.1 0 24s.5 7.7 2.4 11.2l7.9-6.2z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 48c6.4 0 11.8-2.1 15.7-5.8l-7.8-6c-2.2 1.5-5 2.3-7.9 2.3-5.7 0-10.6-3.6-12.4-8.6l-7.9 6.2C7.1 42.6 14.8 48 24 48z"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-center text-gray-400 mt-6"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}