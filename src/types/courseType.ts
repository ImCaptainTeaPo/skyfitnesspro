export interface CourseType {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  order: number;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];
}

export type ExerciseType = {
  _id?: string;
  name: string;
  quantity: number;
};

export interface WorkoutType {
  _id: string;
  name: string;
  video: string;
  exercises?: ExerciseType[];
}

export type CourseProgressEntry = {
  workouts?: {
    workoutId: string;
    workoutCompleted: boolean;
    progressData?: number[];
  }[];
  progress: number;
};

export type ProgressDataType = {
  [courseId: string]: CourseProgressEntry;
};

export type ApiResponseCourseProgressType = {
  courseId: string;
  courseCompleted?: boolean;
  workoutsProgress?: {
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
  }[];
};

export type ApiResponseWorkoutProgressType = {
  workoutId: string;
  workoutCompleted?: boolean;
  progressData: number[];
};
