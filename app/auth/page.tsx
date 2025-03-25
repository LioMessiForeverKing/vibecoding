'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const router = useRouter();

  // List of motivational quotes
  const quotes = [
    "\"Where words fail, music speaks.\" – Hans Christian Andersen",
    "Music is the universal language of mankind. - Henry Wadsworth Longfellow",
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

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google OAuth error:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-black opacity-50" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex justify-center items-center p-6"
      >
        <h1 className="text-3xl font-bold text-white">Meloraise</h1>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 text-center">
        {/* Animated Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-gray-300 italic">
            {quotes[quoteIndex]}
          </p>
        </motion.div>

        {/* Google OAuth Button */}
        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-black py-3 px-6 rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
        >
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
          <span>Sign in with Google</span>
        </motion.button>
      </main>
    </div>
  );
}