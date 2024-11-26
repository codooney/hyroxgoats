import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workout } from '../types';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

interface WorkoutCardProps {
  workout?: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const navigate = useNavigate();

  if (!workout) {
    return (
      <div className="h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
        <span className="text-sm text-gray-400">Rest Day</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/dashboard/workout/${workout.id}`)}
      className={`h-full min-h-[8rem] p-3 rounded-lg border-2 cursor-pointer transition-all ${
        workout.isComplete
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 line-clamp-1">{workout.focus}</span>
          {workout.isComplete && (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
          )}
        </div>
        <div className="flex-grow">
          <p className="text-xs text-gray-600 line-clamp-2">{workout.details}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            {workout.duration}m
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{workout.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};