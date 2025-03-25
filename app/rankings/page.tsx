'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Music, Disc } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: number;
  username: string;
  avatar: string;
  favorite_artist: string;
  favorite_genres: string[];
  ranking_points: number;
}

const RankingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/data/user_rankings.json');
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

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
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="text-green-500 w-6 h-6" />
            <span className="text-lg font-medium">Back to Home</span>
          </motion.div>
        </Link>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2"
        >
          <Trophy className="text-green-500 w-6 h-6" />
          <h1 className="text-xl font-bold">Music Rankings</h1>
        </motion.div>
      </motion.header>
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 pt-8 pb-16 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Top Music Enthusiasts
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full space-y-4"
          >
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-gray-900 bg-opacity-70 rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0 font-bold text-2xl text-green-500 w-8 text-center">
                  {index + 1}
                </div>
                
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src={user.avatar} 
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{user.username}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Music className="w-3 h-3 mr-1" />
                    <span>{user.favorite_artist}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="flex items-center mb-1 bg-gray-800 rounded-lg px-3 py-1.5 shadow-md">
                    <Disc className="w-5 h-5 text-green-400 mr-2" />
                    <span className="font-bold text-xl text-green-300">{user.ranking_points.toLocaleString()} pts</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.favorite_genres.map((genre, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2 py-0.5 bg-green-900 text-green-300 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default RankingsPage;