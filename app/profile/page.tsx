'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Upload, Music, Disc, LogOut, Save, AlertCircle, Info } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [artists, setArtists] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [artistInput, setArtistInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameInput, setNameInput] = useState<string>(user?.user_metadata?.full_name || '');

  const MAX_ARTISTS = 5;
  const MAX_GENRES = 3;

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push('/auth');
        return;
      }

      setUser(data.session.user);
      
      // Fetch existing profile data if available
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();
          
        if (profileData) {
          // If profile exists, populate the form
          setArtists(profileData.favorite_artists || []);
          setGenres(profileData.favorite_genres || []);
          
          if (profileData.avatar_url) {
            setImagePreview(profileData.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      
      setLoading(false);
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/auth');
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleAddArtist = () => {
    if (artistInput && !artists.includes(artistInput) && artists.length < MAX_ARTISTS) {
      setArtists([...artists, artistInput]);
      setArtistInput('');
    } else if (artists.length >= MAX_ARTISTS) {
      showNotification('error', `You can only add up to ${MAX_ARTISTS} favorite artists`);
    }
  };

  const handleRemoveArtist = (index: number) => {
    setArtists(artists.filter((_, i) => i !== index));
  };

  const handleAddGenre = () => {
    if (genreInput && !genres.includes(genreInput) && genres.length < MAX_GENRES) {
      setGenres([...genres, genreInput]);
      setGenreInput('');
    } else if (genres.length >= MAX_GENRES) {
      showNotification('error', `You can only add up to ${MAX_GENRES} favorite genres`);
    }
  };

  const handleRemoveGenre = (index: number) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Form validation function
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!profilePic && !imagePreview) {
      errors.push("Please upload a profile picture");
    }
    
    if (artists.length < MAX_ARTISTS) {
      errors.push(`Please add ${MAX_ARTISTS - artists.length} more favorite artists (${artists.length}/${MAX_ARTISTS})`);
    }
    
    if (genres.length < MAX_GENRES) {
      errors.push(`Please add ${MAX_GENRES - genres.length} more favorite genres (${genres.length}/${MAX_GENRES})`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    // Validate the form first
    const isValid = validateForm();
    if (!isValid) {
      // If form is invalid, show notification but don't proceed
      showNotification('error', 'Please complete your profile before saving');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Step 1: Upload profile picture to storage if there's a new one
      let avatarUrl = imagePreview;


      // PROFILE HAS BEEN CHANGED
      if (profilePic) {
        // If a new profile picture is uploaded, generate a local preview URL
        const fileExt = profilePic.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        avatarUrl = `https://your-image-hosting-service.com/${fileName}`; // Replace with your actual image hosting logic
      }
      
    // Step 2: Save user profile data directly to the `users` table
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          // from the email
          id: user.id,
          avatarURL: avatarUrl, // Save the image URL directly
          top_artists: artists.join(';'), // Save artists as a semicolon-separated string
          top_genres: genres.join(';'), // Save genres as a semicolon-separated string
          name: nameInput, // Save the updated name
        });

      if (profileError) throw profileError;

      showNotification('success', 'Profile updated successfully');

      
      // After 1 second, redirect to the rankings page
      setTimeout(() => {
        router.push('/rankings');
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-t-2 border-green-500 rounded-full mx-auto mb-4"
          />
          <p className="text-green-400 font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-black pointer-events-none" />
      
      {/* Floating music icons (decorative) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0.1, 
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0.5 + Math.random(),
            }}
            animate={{
              y: [null, '-100%'],
              rotate: [0, Math.random() * 360]
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 20,
              ease: 'linear',
              delay: Math.random() * 5
            }}
            className="absolute text-green-500 opacity-10"
          >
            {i % 2 === 0 ? <Music size={24} /> : <Disc size={28} />}
          </motion.div>
        ))}
      </div>
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === 'success' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? 
              <Save size={18} /> : 
              <AlertCircle size={18} />
            }
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
              Your Profile
            </span>
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </motion.button>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Profile Picture */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-green-500/50 cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-gray-600" />
                    )}
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer shadow-lg"
                    onClick={triggerFileInput}
                  >
                    <Upload size={16} className="text-black" />
                  </motion.div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </div>

                
                
                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user?.user_metadata?.full_name || 'Music Enthusiast'}
                  </h2>
                  <p className="text-green-400 font-medium">{user?.email}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

            {/* Change Name Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Change Your Name To Real Name</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-grow bg-black/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

          {/* Favorite Artists Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Music size={18} className="text-green-400 mr-2" />
                  Your Favorite Artists
                </h3>
                <span className={`text-sm ${artists.length === MAX_ARTISTS ? 'text-green-500' : 'text-gray-400'}`}>
                  {artists.length}/{MAX_ARTISTS}
                </span>
              </div>
              
              
              <div className="space-y-4">
                {/* Input for adding artists */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddArtist()}
                    placeholder="Add artist (e.g., Taylor Swift)"
                    disabled={artists.length >= MAX_ARTISTS}
                    className="flex-grow bg-black/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddArtist}
                    disabled={artists.length >= MAX_ARTISTS}
                    className="px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </motion.button>
                </div>
                
                {/* Artist tags */}
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {artists.map((artist, index) => (
                      <motion.span
                        key={artist}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-green-900/50 border border-green-500/30 text-green-300 rounded-full text-sm font-medium inline-flex items-center"
                      >
                        {artist}
                        <button 
                          onClick={() => handleRemoveArtist(index)}
                          className="ml-2 rounded-full hover:bg-green-800 p-1"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  
                  {artists.length === 0 && (
                    <p className="text-gray-500 text-sm italic">Add up to 5 of your favorite music artists</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Favorite Genres Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Disc size={18} className="text-green-400 mr-2" />
                  Your Favorite Genres
                </h3>
                <span className={`text-sm ${genres.length === MAX_GENRES ? 'text-green-500' : 'text-gray-400'}`}>
                  {genres.length}/{MAX_GENRES}
                </span>
              </div>
              
              
              <div className="space-y-4">
                {/* Input for adding genres */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()}
                    placeholder="Add genre (e.g., Rock, Jazz)"
                    disabled={genres.length >= MAX_GENRES}
                    className="flex-grow bg-black/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddGenre}
                    disabled={genres.length >= MAX_GENRES}
                    className="px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </motion.button>
                </div>

                
                
                {/* Genre tags */}
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {genres.map((genre, index) => (
                      <motion.span
                        key={genre}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-green-900/50 border border-green-500/30 text-green-300 rounded-full text-sm font-medium inline-flex items-center"
                      >
                        {genre}
                        <button 
                          onClick={() => handleRemoveGenre(index)}
                          className="ml-2 rounded-full hover:bg-green-800 p-1"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  
                  {genres.length === 0 && (
                    <p className="text-gray-500 text-sm italic">Add up to 3 of your favorite music genres</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Validation warnings */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start space-x-3">
                  <Info size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-400 mb-2">Complete your profile</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-amber-300">{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-black font-bold rounded-lg shadow-lg flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-t-2 border-black rounded-full"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}