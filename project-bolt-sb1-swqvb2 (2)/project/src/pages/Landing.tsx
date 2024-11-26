import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, UserPlus, UserCircle } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import AddProfileModal from '../components/AddProfileModal';

const Landing = () => {
  const [showAddProfile, setShowAddProfile] = useState(false);
  const { profiles, activeProfile, setActiveProfile } = useProfileStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">HYROX Goats</h1>
          <p className="text-xl text-gray-300">Training Elite Athletes for HYROX Excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                activeProfile === profile.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveProfile(profile.id)}
            >
              <div className="p-8">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative w-24 h-24">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-gray-400">{profile.status}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 mb-2">Current Phase</p>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      Base Training
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Dumbbell className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add Profile Card */}
          <div
            onClick={() => setShowAddProfile(true)}
            className="bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <UserPlus className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Add Profile</h2>
              <p className="text-gray-400">Create a new training profile</p>
            </div>
          </div>
        </div>
      </div>

      {showAddProfile && (
        <AddProfileModal onClose={() => setShowAddProfile(false)} />
      )}
    </div>
  );
};

export default Landing;