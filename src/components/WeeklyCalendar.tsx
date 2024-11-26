import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, addDays, format } from 'date-fns';
import { useWorkoutStore } from '../store/workoutStore';
import WorkoutCard from './WorkoutCard';

interface WeeklyCalendarProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedWeek, onWeekChange }) => {
  const workouts = useWorkoutStore((state) => state.workouts);
  const weekWorkouts = workouts.filter((w) => w.week === selectedWeek);
  const startDate = startOfWeek(new Date());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Week {selectedWeek}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onWeekChange(selectedWeek - 1)}
            disabled={selectedWeek === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onWeekChange(selectedWeek + 1)}
            disabled={selectedWeek === 18}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
        {Array.from({ length: 7 }, (_, i) => {
          const date = addDays(startDate, i);
          const dayWorkout = weekWorkouts.find((w) => w.day === i + 1);
          
          return (
            <div key={i} className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 mb-2">
                {format(date, 'EEE')}
              </div>
              <WorkoutCard workout={dayWorkout} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;