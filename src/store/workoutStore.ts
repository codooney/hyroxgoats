import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workout } from '../types';

interface WorkoutStore {
  workouts: { [profileId: string]: Workout[] };
  updateWorkout: (profileId: string, id: string, updates: Partial<Workout>) => void;
  updateWorkouts: (profileId: string, newWorkouts: Workout[]) => void;
  toggleWorkoutCompletion: (profileId: string, id: string) => void;
  getTotalTimeInvested: (profileId: string) => number;
  getWorkoutsForProfile: (profileId: string) => Workout[];
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: {},
      
      updateWorkout: (profileId, id, updates) => set(state => ({
        workouts: {
          ...state.workouts,
          [profileId]: (state.workouts[profileId] || []).map(workout =>
            workout.id === id ? { ...workout, ...updates } : workout
          )
        }
      })),

      updateWorkouts: (profileId, newWorkouts) => set(state => ({
        workouts: {
          ...state.workouts,
          [profileId]: newWorkouts
        }
      })),

      toggleWorkoutCompletion: (profileId, id) => set(state => ({
        workouts: {
          ...state.workouts,
          [profileId]: (state.workouts[profileId] || []).map(workout =>
            workout.id === id ? { ...workout, isComplete: !workout.isComplete } : workout
          )
        }
      })),

      getTotalTimeInvested: (profileId) => {
        const profileWorkouts = get().workouts[profileId] || [];
        return profileWorkouts
          .filter(w => w.isComplete)
          .reduce((total, workout) => total + parseInt(workout.duration), 0);
      },

      getWorkoutsForProfile: (profileId) => {
        return get().workouts[profileId] || [];
      }
    }),
    {
      name: 'hyrox-workouts',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            workouts: {}
          };
        }
        return persistedState;
      },
    }
  )
);