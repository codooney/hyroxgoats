import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useWorkoutStore } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';
import { Workout } from '../types';

const CSVUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const updateWorkouts = useWorkoutStore((state) => state.updateWorkouts);
  const activeProfile = useProfileStore((state) => state.getActiveProfile());

  const getDayOfWeek = (day: string): string => {
    return day.split(' ')[0];
  };

  const processWeeklyData = (row: any, rowIndex: number) => {
    const weeks = [];
    const dayOfWeek = getDayOfWeek(row.Day || '');
    const order = row.Day?.includes('Workout 2') ? 2 : 1;

    for (let week = 1; week <= 11; week++) {
      const weekKey = `Week ${week}`;
      if (row[weekKey] && row[weekKey].trim() !== '') {
        weeks.push({
          week,
          day: rowIndex + 1,
          dayOfWeek,
          phase: 'Base',
          focus: row.Focus || '',
          details: row[weekKey],
          location: row.Where || 'Home',
          duration: row.Time || '60',
          isComplete: false,
          id: `week${week}-day${rowIndex + 1}-${order}`,
          order
        });
      }
    }
    return weeks;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');
    setSuccess('');

    if (!activeProfile?.id) {
      setError('No active profile selected.');
      return;
    }

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const allWorkouts = [];
            results.data.forEach((row: any, index: number) => {
              if (row.Focus && row.Day) {
                const weeklyWorkouts = processWeeklyData(row, index);
                allWorkouts.push(...weeklyWorkouts);
              }
            });

            const validWorkouts = allWorkouts.filter(w => 
              w.details && 
              w.details.trim() !== '' && 
              w.focus && 
              w.focus.trim() !== '' &&
              w.dayOfWeek
            );

            if (validWorkouts.length === 0) {
              setError('No valid workouts found in the CSV file.');
              return;
            }

            const sortedWorkouts = validWorkouts.sort((a, b) => {
              if (a.week === b.week) {
                if (a.dayOfWeek === b.dayOfWeek) {
                  return (a.order || 0) - (b.order || 0);
                }
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
              }
              return a.week - b.week;
            });

            updateWorkouts(activeProfile.id, sortedWorkouts);
            setSuccess('Training plan successfully imported!');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (err) {
            setError('Error processing file. Please check the format and try again.');
            console.error(err);
          }
        },
        error: (error) => {
          setError(`Error reading file: ${error.message}`);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Import Training Plan</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2 sm:mb-0"
            disabled={!activeProfile?.id}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {error && (
          <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">CSV Format Requirements:</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Headers should include: Day, Focus, Where, Time, Week 1-11</li>
            <li>Day column should specify the day (e.g., "Monday Workout 1")</li>
            <li>Multiple workouts per day should be numbered (e.g., "Monday Workout 2")</li>
            <li>Focus column should not be empty</li>
            <li>Workouts should be filled in for each week</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;