export interface Workout {
  id: string;
  week: number;
  phase: 'Base' | 'Build';
  day: number;
  dayOfWeek: string;
  focus: string;
  details: string;
  location: string;
  duration: string;
  isComplete: boolean;
  order?: number; // For multiple workouts on the same day
}

export interface RaceTarget {
  name: string;
  date: string;
}

export interface DayWorkouts {
  [key: string]: Workout[];
}