import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';
import { ArrowLeft, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const DailyWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeProfile = useProfileStore((state) => state.getActiveProfile());
  const getWorkoutsForProfile = useWorkoutStore((state) => state.getWorkoutsForProfile);
  const toggleWorkoutCompletion = useWorkoutStore((state) => state.toggleWorkoutCompletion);
  
  if (!activeProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No active profile selected</p>
      </div>
    );
  }

  const workouts = getWorkoutsForProfile(activeProfile.id);
  const workout = workouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Workout not found</p>
      </div>
    );
  }

  const handleComplete = () => {
    toggleWorkoutCompletion(activeProfile.id, workout.id);
    navigate('/dashboard/plan');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/dashboard/plan')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Plan
      </button>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {workout.dayOfWeek}
              </h1>
              <p className="text-lg text-gray-700 mt-1">{workout.focus}</p>
            </div>
            {workout.isComplete && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Completed
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{workout.duration} mins</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{workout.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Week {workout.week}</span>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-center text-base font-medium transition-colors ${
              workout.isComplete
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {workout.isComplete ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Details</h3>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-line">
              {workout.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyWorkout;