'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Music, Disc } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUserData } from '../api/fetchData';

// Define the structure of the user data
interface User {
  name: string;
  genre: string;
  artists: string;
  points: number;
  profilePic: string;
}

const RankingsPage = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store user rankings
  const [loading, setLoading] = useState(true); // State to manage loading state


  // test
  console.log("Test fetch user data", fetchUserData())
  console.log(fetchUserData());
  // Mock JSON data simulating an API response
  const mockApiResponse = {
    rank: {
      person1: {
        name: "Alice Johnson",
        genre: "Pop",
        artists: "Taylor Swift, Ed Sheeran",
        points: 1200,
        profilePic: "",
      },
      person2: {
        name: "Bob Smith",
        genre: "Rock",
        artists: "Nirvana, Foo Fighters",
        points: 1100,
        profilePic: "",
      },
      person3: {
        name: "Charlie Brown",
        genre: "Hip-Hop",
        artists: "Kanye West, Drake",
        points: 1050,
        profilePic: "",
      },
      person4: {
        name: "Diana Prince",
        genre: "Classical",
        artists: "Beethoven, Mozart",
        points: 980,
        profilePic: "",
      },
    },
  };

  // Fetch rankings (mocked for now)
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          // Convert mock API response to an array of users
          const data = Object.values(mockApiResponse.rank);
          setUsers(data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Background gradient */}
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

        {/* Loading Spinner */}
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
            {/* Render each user */}
            {users.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-gray-900 bg-opacity-70 rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
              >
                {/* Rank Number */}
                <div className="flex-shrink-0 font-bold text-2xl text-green-500 w-8 text-center">
                  {index + 1}
                </div>

                {/* Profile Picture */}
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.profilePic}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Music className="w-3 h-3 mr-1" />
                    <span>{user.artists}</span>
                  </div>
                </div>

                {/* Points and Genres */}
                <div className="flex-shrink-0">
                  <div className="flex items-center mb-1 bg-gray-800 rounded-lg px-3 py-1.5 shadow-md">
                    <Disc className="w-5 h-5 text-green-400 mr-2" />
                    <span className="font-bold text-xl text-green-300">
                      {(user.points || 0).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-0.5 bg-green-900 text-green-300 rounded-full">
                      {user.genre}
                    </span>
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