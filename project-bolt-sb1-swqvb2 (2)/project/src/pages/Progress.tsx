import React from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { BarChart3 } from 'lucide-react';

const Progress = () => {
  const workouts = useWorkoutStore((state) => state.workouts);
  const totalWeeks = 11;

  const weeklyProgress = Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const weekNumber = weekIndex + 1;
    const weekWorkouts = workouts.filter(w => w.week === weekNumber);
    const completed = weekWorkouts.filter(w => w.isComplete).length;
    const total = weekWorkouts.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    return { week: weekNumber, completed, total, percentage };
  });

  const overallCompleted = workouts.filter(w => w.isComplete).length;
  const overallTotal = workouts.length;
  const overallPercentage = Math.round((overallCompleted / overallTotal) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Overall Progress: {overallPercentage}%
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Breakdown</h2>
        <div className="space-y-4">
          {weeklyProgress.map(({ week, completed, total, percentage }) => (
            <div key={week} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Week {week}</span>
                <span className="text-gray-500">{completed}/{total} workouts</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;