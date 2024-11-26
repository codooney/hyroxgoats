import React from 'react';
import { Trophy, Target, Clock, Calendar } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';
import { formatTimeInvested, getDaysUntilRace } from '../utils/timeUtils';

const Profile = () => {
  const activeProfile = useProfileStore((state) => state.getActiveProfile());
  const getWorkoutsForProfile = useWorkoutStore((state) => state.getWorkoutsForProfile);
  const getTotalTimeInvested = useWorkoutStore((state) => state.getTotalTimeInvested);

  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-gray-500">No profile selected. Please create or select a profile.</p>
      </div>
    );
  }

  const workouts = getWorkoutsForProfile(activeProfile.id);
  const completedWorkouts = workouts.filter((w) => w.isComplete).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  const totalTimeInvested = getTotalTimeInvested(activeProfile.id);
  const daysUntilRace = activeProfile.raceTarget ? getDaysUntilRace(activeProfile.raceTarget.date) : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <div className="relative mb-4 sm:mb-0">
            <img
              src={activeProfile.image}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{activeProfile.name}</h1>
                <p className="text-lg text-gray-600">{activeProfile.status}</p>
              </div>
              {activeProfile.raceTarget && (
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">{activeProfile.raceTarget.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {daysUntilRace !== null ? `T-${daysUntilRace} days` : 'Date not set'}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Base Phase
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Week {Math.ceil(completedWorkouts / 7)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Progress</h3>
              <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <Target className="h-8 w-8 text-red-500" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Workouts</h3>
              <p className="text-3xl font-bold text-gray-900">{completedWorkouts}/{totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <Clock className="h-8 w-8 text-blue-500" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Time Invested</h3>
              <p className="text-3xl font-bold text-gray-900">{formatTimeInvested(totalTimeInvested)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;