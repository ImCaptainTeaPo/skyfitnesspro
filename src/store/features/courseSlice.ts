import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutType, CourseType } from '@/types/courseType';

export type initialStateType = {
  currentCourse: CourseType | null;
  allCourses: CourseType[];
  favoriteCourses: string[];
  fetchError: string | null;
  fetchIsLoading: boolean;
  currentWorkout: WorkoutType | null;
  courseProgress: {
    [courseId: string]: {
      workouts?: {
        workoutId: string;
        workoutCompleted: boolean;
        progressData?: number[];
      }[];
      progress: number;
    };
  };
};

const initialState: initialStateType = {
  currentCourse: null,
  allCourses: [],
  favoriteCourses: [],
  fetchError: null,
  fetchIsLoading: true,
  currentWorkout: null,
  courseProgress: {},
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
    },
    setFavoriteCourses: (state, action: PayloadAction<string[]>) => {
      state.favoriteCourses = action.payload;
    },
    addFavoriteCourse: (state, action: PayloadAction<string>) => {
      state.favoriteCourses = [...state.favoriteCourses, action.payload];
    },
    removeFavoriteCourse: (state, action: PayloadAction<string>) => {
      state.favoriteCourses = state.favoriteCourses.filter(
        (id) => id !== action.payload,
      );
    },
    setCurrentWorkout(state, action: PayloadAction<WorkoutType>) {
      state.currentWorkout = action.payload;
    },
    setCurrentCourse(state, action: PayloadAction<CourseType>) {
      state.currentCourse = action.payload;
    },
    clearCurrentWorkout(state) {
      state.currentWorkout = null;
    },

    setCourseProgress: (
      state,
      action: PayloadAction<{
        courseId: string;
        workouts?: {
          workoutId: string;
          workoutCompleted: boolean;
          progressData?: number[];
        }[];
        progress: number;
      }>,
    ) => {
      state.courseProgress[action.payload.courseId] = {
        workouts: action.payload.workouts,
        progress: action.payload.progress,
      };
    },
    setWorkoutProgress: (
      state,
      action: PayloadAction<{
        courseId: string;
        workoutId: string;
        progressData: number[];
      }>,
    ) => {
      const { courseId, workoutId, progressData } = action.payload;

      
      if (!state.courseProgress) state.courseProgress = {};
      if (!state.courseProgress[courseId]) {
        state.courseProgress[courseId] = { workouts: [], progress: 0 }; 
      }

      const existingWorkout = state.courseProgress[courseId].workouts?.find(
        (w) => w.workoutId === workoutId,
      );

      if (existingWorkout) {
        existingWorkout.progressData = progressData;
      } else {
        state.courseProgress[courseId].workouts?.push({
          workoutId,
          progressData,
          workoutCompleted: false,
        });
      }
    },

    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
  },
});

export const {
  setAllCourses,
  setFavoriteCourses,
  addFavoriteCourse,
  removeFavoriteCourse,
  setFetchError,
  setFetchIsLoading,
  setCurrentWorkout,
  clearCurrentWorkout,
  setCurrentCourse,
  setCourseProgress,
  setWorkoutProgress,
} = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
