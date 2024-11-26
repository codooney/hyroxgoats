import React, { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/ImageUpload';
import CSVUpload from '../components/CSVUpload';
import { Calendar, Edit2, Save, Lock, X } from 'lucide-react';
import { Workout } from '../types';

const Admin = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const checkAdmin = useAuthStore((state) => state.checkAdmin);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const activeProfile = useProfileStore((state) => state.getActiveProfile());
  const updateRaceTarget = useProfileStore((state) => state.updateRaceTarget);
  const [raceForm, setRaceForm] = useState({
    name: activeProfile?.raceTarget?.name || '',
    date: activeProfile?.raceTarget?.date || ''
  });

  const getWorkoutsForProfile = useWorkoutStore((state) => state.getWorkoutsForProfile);
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [workoutForm, setWorkoutForm] = useState<Partial<Workout>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAdmin(password)) {
      setError('Invalid password');
    }
  };

  const handleRaceTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeProfile) {
      updateRaceTarget({
        name: raceForm.name,
        date: raceForm.date
      });
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout.id);
    setWorkoutForm(workout);
  };

  const handleSaveWorkout = () => {
    if (editingWorkout && workoutForm && activeProfile) {
      updateWorkout(activeProfile.id, editingWorkout, workoutForm);
      setEditingWorkout(null);
      setWorkoutForm({});
    }
  };

  const handleWorkoutFormChange = (field: keyof Workout, value: string | number) => {
    setWorkoutForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Access</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Password"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Lock className="w-4 h-4 mr-2" />
                Access Admin Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-gray-500">Please select a profile to manage.</p>
      </div>
    );
  }

  const workouts = getWorkoutsForProfile(activeProfile.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>

      <ImageUpload />
      <CSVUpload />

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Target Race</h2>
        <form onSubmit={handleRaceTargetSubmit} className="space-y-4">
          <div>
            <label htmlFor="raceName" className="block text-sm font-medium text-gray-700">
              Race Name
            </label>
            <input
              type="text"
              id="raceName"
              value={raceForm.name}
              onChange={(e) => setRaceForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="raceDate" className="block text-sm font-medium text-gray-700">
              Race Date
            </label>
            <input
              type="date"
              id="raceDate"
              value={raceForm.date}
              onChange={(e) => setRaceForm(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Race Target
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Training Plan</h2>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Base Phase: Weeks 1-11
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Build Phase: Weeks 12-18
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.week}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.dayOfWeek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.phase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingWorkout === workout.id ? (
                      <input
                        type="text"
                        value={workoutForm.focus || ''}
                        onChange={(e) => handleWorkoutFormChange('focus', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      workout.focus
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingWorkout === workout.id ? (
                      <textarea
                        value={workoutForm.details || ''}
                        onChange={(e) => handleWorkoutFormChange('details', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                      />
                    ) : (
                      <div className="whitespace-pre-line">{workout.details}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingWorkout === workout.id ? (
                      <input
                        type="text"
                        value={workoutForm.location || ''}
                        onChange={(e) => handleWorkoutFormChange('location', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      workout.location
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingWorkout === workout.id ? (
                      <input
                        type="text"
                        value={workoutForm.duration || ''}
                        onChange={(e) => handleWorkoutFormChange('duration', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      workout.duration
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingWorkout === workout.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveWorkout}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingWorkout(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditWorkout(workout)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;