import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';

const Plan = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<'selection' | 'base' | 'build'>('selection');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const activeProfile = useProfileStore((state) => state.getActiveProfile());
  const getWorkoutsForProfile = useWorkoutStore((state) => state.getWorkoutsForProfile);

  const workouts = activeProfile ? getWorkoutsForProfile(activeProfile.id) : [];

  // Group workouts by day
  const getWeekWorkouts = (week: number) => {
    const weekWorkouts = workouts.filter(w => w.week === week);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => {
      const dayWorkouts = weekWorkouts.filter(w => w.dayOfWeek === day)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return {
        day,
        workouts: dayWorkouts
      };
    });
  };

  const weekWorkouts = getWeekWorkouts(selectedWeek);
  const completedThisWeek = weekWorkouts.flatMap(d => d.workouts).filter(w => w.isComplete).length;
  const totalThisWeek = weekWorkouts.flatMap(d => d.workouts).length;

  if (selectedPhase === 'selection') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Training Plan</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div 
            onClick={() => setSelectedPhase('base')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-500" />
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Base Phase</h2>
            <p className="text-sm text-gray-600 mb-3">Foundation building period focusing on aerobic capacity and strength endurance.</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Weeks 1-11
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Build Phase</h2>
            <p className="text-sm text-gray-600 mb-3">Advanced training period with increased intensity and specific HYROX preparation.</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Weeks 12-18 (Coming Soon)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSelectedPhase('selection')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Base Phase</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Week {selectedWeek} Progress: {completedThisWeek}/{totalThisWeek}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek === 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Week {selectedWeek}</h2>
            <button
              onClick={() => setSelectedWeek(Math.min(11, selectedWeek + 1))}
              disabled={selectedWeek === 11}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {weekWorkouts.map(({ day, workouts }) => (
            <div key={day} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{day}</h3>
              <div className="space-y-2">
                {workouts.map((workout, index) => (
                  <div
                    key={workout.id}
                    onClick={() => navigate(`/dashboard/workout/${workout.id}`)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      workout.isComplete
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 font-medium">
                          {workouts.length > 1 ? `Workout ${index + 1}` : 'Workout'}
                        </p>
                        <h4 className="text-lg font-semibold text-gray-900 mt-1">{workout.focus}</h4>
                      </div>
                      {workout.isComplete && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{workout.details}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {workout.duration} mins
                      </span>
                      <span>{workout.location}</span>
                    </div>
                  </div>
                ))}
                {workouts.length === 0 && (
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                    <p className="text-gray-500 text-center">Rest Day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;