'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Music, Disc, Share2, XCircle, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUserData } from '../api/fetchData';

// Define the structure of a profile
interface Profile {
  id: string;
  name: string;
  pfpImgUrl: string;
  topGenres: string;
  topArtists: string;
}

// Mock data as fallback
const mockProfiles: { [key: string]: Profile } = {
  person1: {
    id: "person1",
    name: "Emma Wilson",
    pfpImgUrl: "https://i.pravatar.cc/300?img=1",
    topGenres: "Pop;R&B;Alternative",
    topArtists: "Taylor Swift;The Weeknd;Lana Del Rey;Billie Eilish;Harry Styles"
  },
  person2: {
    id: "person2",
    name: "Michael Chen",
    pfpImgUrl: "https://i.pravatar.cc/300?img=2",
    topGenres: "Hip Hop;Rap;EDM",
    topArtists: "Kendrick Lamar;Drake;Travis Scott;Tyler, The Creator;J. Cole"
  },
  person3: {
    id: "person3",
    name: "Sophia Rodriguez",
    pfpImgUrl: "https://i.pravatar.cc/300?img=3",
    topGenres: "Rock;Indie;Alternative",
    topArtists: "Arctic Monkeys;The Strokes;Tame Impala;Radiohead;The 1975"
  },
  person4: {
    id: "person4",
    name: "Jackson Williams",
    pfpImgUrl: "https://i.pravatar.cc/300?img=4",
    topGenres: "Electronic;House;Techno",
    topArtists: "Daft Punk;Calvin Harris;Disclosure;ODESZA;Flume"
  },
  person5: {
    id: "person5",
    name: "Olivia Davis",
    pfpImgUrl: "https://i.pravatar.cc/300?img=5",
    topGenres: "R&B;Soul;Jazz",
    topArtists: "Frank Ocean;Daniel Caesar;SZA;H.E.R.;Jorja Smith"
  },
  person6: {
    id: "person6",
    name: "Ethan Lee",
    pfpImgUrl: "https://i.pravatar.cc/300?img=6",
    topGenres: "Classical;Ambient;Post-rock",
    topArtists: "Hans Zimmer;Max Richter;Ludovico Einaudi;Brian Eno;Sigur Rós"
  },
  person7: {
    id: "person7",
    name: "Ava Johnson",
    pfpImgUrl: "https://i.pravatar.cc/300?img=7",
    topGenres: "Country;Folk;Bluegrass",
    topArtists: "Chris Stapleton;Kacey Musgraves;Tyler Childers;Sturgill Simpson;Colter Wall"
  },
  person8: {
    id: "person8",
    name: "Noah Martin",
    pfpImgUrl: "https://i.pravatar.cc/300?img=8",
    topGenres: "Metal;Rock;Punk",
    topArtists: "Metallica;Tool;System of a Down;Slipknot;Rage Against the Machine"
  },
  person9: {
    id: "person9",
    name: "Muslim Hussaini",
    pfpImgUrl: "https://i.ibb.co/wh6Wrs3f/muslim.png", // Updated to use pravatar which is already configured
    topGenres: "Girl Pop;Alternative Pakistani Pop;Republican Maga Pop",
    topArtists: "Megan Thee Stallion;Sexxy Redd;Tom MacDonald;KSI;Dax"
  }
};

export default function ChoosePage() {
  // State for tracking available profiles
  const [availableProfiles, setAvailableProfiles] = useState<string[]>([]);
  const [shownPairs, setShownPairs] = useState<Set<string>>(new Set());
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>(mockProfiles);
  const [loading, setLoading] = useState(true);
  
  // Current selection states
  const [leftProfile, setLeftProfile] = useState<Profile | null>(null);
  const [rightProfile, setRightProfile] = useState<Profile | null>(null);
  
  // Animation states
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [outOfProfiles, setOutOfProfiles] = useState(false);
  
  // Fetch real data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const userData = await fetchUserData();
        
        if (userData && userData.length > 0) {
          // Transform the data to match our Profile interface
          const formattedProfiles: { [key: string]: Profile } = {};
          
          userData.forEach((user: any, index: number) => {
            formattedProfiles[`user${index}`] = {
              id: `user${index}`,
              name: user.name || `User ${index}`,
              pfpImgUrl: user.profile_image_url || `https://i.pravatar.cc/300?img=${index + 1}`,
              topGenres: user.top_genres || "Pop;Rock;Electronic",
              topArtists: user.top_artists || "Artist 1;Artist 2;Artist 3;Artist 4;Artist 5"
            };
          });
          
          // If we have real data, use it; otherwise, fall back to mock data
          if (Object.keys(formattedProfiles).length > 0) {
            setProfiles(formattedProfiles);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fall back to mock data if there's an error
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Initialize and reset profiles after data is loaded
  useEffect(() => {
    if (!loading) {
      resetProfiles();
    }
  }, [loading, profiles]);

  // Reset available profiles and select initial pair
  const resetProfiles = () => {
    const profileIds = Object.keys(profiles);
    setAvailableProfiles(profileIds);
    setShownPairs(new Set());
    setSelectedProfile(null);
    setShowDetails(false);
    setOutOfProfiles(false);
    selectRandomPair(profileIds);
  };

  // Select a random pair of profiles
  const selectRandomPair = (profileIds: string[]) => {
    if (profileIds.length < 2) {
      setOutOfProfiles(true);
      return;
    }

    // Try to find a pair that hasn't been shown
    let attempts = 0;
    const maxAttempts = 15; // Limit attempts to prevent infinite loops
    
    while (attempts < maxAttempts) {
      const leftIndex = Math.floor(Math.random() * profileIds.length);
      let rightIndex = Math.floor(Math.random() * profileIds.length);
      
      // Make sure we don't select the same profile twice
      while (leftIndex === rightIndex) {
        rightIndex = Math.floor(Math.random() * profileIds.length);
      }
      
      const leftId = profileIds[leftIndex];
      const rightId = profileIds[rightIndex];
      
      // Check if this pair has been shown
      const pairKey = `${leftId}-${rightId}`;
      const reversePairKey = `${rightId}-${leftId}`;
      
      if (!shownPairs.has(pairKey) && !shownPairs.has(reversePairKey)) {
        setLeftProfile(profiles[leftId]);
        setRightProfile(profiles[rightId]);
        
        // Mark this pair as shown
        const newShownPairs = new Set(shownPairs);
        newShownPairs.add(pairKey);
        setShownPairs(newShownPairs);
        
        return;
      }
      
      attempts++;
    }
    
    // If we've exhausted unique combinations
    if (attempts >= maxAttempts) {
      setOutOfProfiles(true);
    }
  };

  // Handle profile selection
  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowDetails(true);
    
    // After showing details, prepare for next pair
    setTimeout(() => {
      setShowDetails(false);
      
      // After animation completes, select next pair
      setTimeout(() => {
        setSelectedProfile(null);
        /*NOTE THIS DURATION */
        // If left was selected, keep right and get a new left
        // If right was selected, keep left and get a new right
        if (profile.id === leftProfile?.id) {
          selectRandomPair([...availableProfiles.filter(id => id !== rightProfile?.id)]);
        } else {
          selectRandomPair([...availableProfiles.filter(id => id !== leftProfile?.id)]);
        }
      }, 1000); // Increased delay for animation completion
    }, 4000); // Increased duration for user interaction
  };

  // Split the genres and artists strings
  const getGenresArray = (genresString: string) => genresString.split(';');
  const getArtistsArray = (artistsString: string) => artistsString.split(';');

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-green-900 to-black opacity-50" />
      
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
          <Disc className="text-green-500 w-6 h-6" />
          <h1 className="text-xl font-bold">Choose Your Match</h1>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-4 pb-16">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-8 text-center"
        >
          Whose music taste matches yours?
        </motion.h2>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900/70 backdrop-blur-md rounded-xl p-8 max-w-lg text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
            <h3 className="text-xl font-bold">Loading profiles...</h3>
            <p className="text-gray-300 mt-2">Finding your perfect music matches</p>
          </motion.div>
        ) : !outOfProfiles ? (
          <div className="w-full max-w-5xl">
            {/* Profile Cards Container */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
              {/* Left Profile */}
              <ProfileCard 
                profile={leftProfile}
                position="left"
                onSelect={() => leftProfile && handleSelectProfile(leftProfile)}
                disabled={!!selectedProfile}
              />

              {/* VS Text */}
              <div className="flex items-center justify-center">
                <div className="text-xl md:text-2xl font-bold text-green-500 py-6">VS</div>
              </div>

              {/* Right Profile */}
              <ProfileCard 
                profile={rightProfile}
                position="right"
                onSelect={() => rightProfile && handleSelectProfile(rightProfile)}
                disabled={!!selectedProfile}
              />
            </div>
          </div>
        ) : (
          // Out of profiles message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/70 backdrop-blur-md rounded-xl p-8 max-w-lg text-center"
          >
            <XCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Uh-oh, we ran out of people!</h3>
            <p className="text-gray-300 mb-6">
              Help us grow our community so you can discover more musical matches.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetProfiles}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-black rounded-full font-bold"
              >
                <RefreshCw size={18} />
                <span>Start Over</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-green-500 text-green-500 rounded-full font-bold"
              >
                <Share2 size={18} />
                <span>Share App</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Selected Profile Details Overlay */}
        <AnimatePresence>
          {showDetails && selectedProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-20 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-gradient-to-b from-green-900 to-gray-900 rounded-xl overflow-hidden max-w-lg w-full"
              >
                {/* Profile Header */}


                {/* TWEAK THIS IN ORDER TO TWEAK THE SIZE  */}
                <div className="relative h-75">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
                  <div className="w-full h-full relative overflow-hidden">
                    <Image
                      src={selectedProfile.pfpImgUrl}
                      alt={selectedProfile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {selectedProfile.name}
                  </h3>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-1 bg-green-500 mt-2"
                    />
                  </div>
                </div>
                
                {/* Profile Content */}
                <div className="p-6 space-y-6">
                  {/* Top Genres */}
                  <div>
                    <h4 className="text-green-400 font-medium flex items-center mb-3">
                      <Disc className="w-4 h-4 mr-2" />
                      Top Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getGenresArray(selectedProfile.topGenres).map((genre, index) => (
                        <motion.span
                          key={genre}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + (index * 0.1) }}
                          className="px-3 py-1 bg-green-900/50 border border-green-500/30 
                                   text-green-300 rounded-full text-sm"
                        >
                          {genre}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Top Artists */}
                  <div>
                    <h4 className="text-green-400 font-medium flex items-center mb-3">
                      <Music className="w-4 h-4 mr-2" />
                      Top Artists
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {getArtistsArray(selectedProfile.topArtists).map((artist, index) => (
                        <motion.div
                          key={artist}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex items-center"
                        >
                          <span className="text-green-500 mr-2">{index + 1}.</span>
                          <span>{artist}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Match Status */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 flex items-center"
                  >
                    <CheckCircle className="text-green-500 w-5 h-5 mr-3 flex-shrink-0" />
                    <span>You've matched with {selectedProfile.name}'s music taste!</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Profile Card Component
interface ProfileCardProps {
  profile: Profile | null;
  position: 'left' | 'right';
  onSelect: () => void;
  disabled: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, position, onSelect, disabled }) => {
  if (!profile) return null;

  // Utility functions to split genres and artists
  const getGenresArray = (genresString: string) => genresString.split(';');
  const getArtistsArray = (artistsString: string) => artistsString.split(';');

  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex-1 max-w-md"
    >
      <motion.div
        whileHover={!disabled ? { scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? onSelect : undefined}
        className={`h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden 
                   border border-gray-700 shadow-xl cursor-pointer ${disabled ? 'opacity-70' : ''}`}
      >
        {/* Profile Picture with Better Visibility */}
        <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-md z-10 bg-black/70" /> {/* Increased blur and opacity */}

          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={profile.pfpImgUrl}
              alt={profile.name}
              fill
              className="object-contain scale-110" /* Slightly enlarged for better visibility */
              style={{ opacity: 0.85 }} /* Make image slightly transparent */
            />
          </div>

          {/* Enhanced gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-20" />

          {/* Top Artists and Genres */}
          <div className="absolute bottom-0 w-full p-4 z-30">
            <div className="text-sm text-gray-200 space-y-1 bg-black/30 p-2 rounded-lg"> {/* Added background for text */}
              <div>
                <span className="font-bold text-green-400">Top Artists:</span>{' '}
                {getArtistsArray(profile.topArtists).slice(0, 5).join(', ')}
              </div>
              <div>
                <span className="font-bold text-green-400">Top Genres:</span>{' '}
                {getGenresArray(profile.topGenres).slice(0, 3).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="p-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={disabled}
            className={`px-6 py-3 rounded-full font-bold flex items-center justify-center 
                      bg-green-500 text-black hover:bg-green-600 transition-colors 
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Choose This
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};