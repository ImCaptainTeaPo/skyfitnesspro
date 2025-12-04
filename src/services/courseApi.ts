import { BASE_URL, RoutesApp } from '@/constants';
import axios from 'axios';
import { CourseCardType } from '@/types/courseCard';
import { WorkoutType, ApiResponseCourseProgressType,ApiResponseWorkoutProgressType } from '@/types/courseType';
import { tokensType } from './auth';

type courseUserProp = {
  courseId: string;
};
type ApiError = {
  error?: string;
  message?: string;
};
export const getCourses = async (): Promise<CourseCardType[]> => {
  try {
    const res = await axios.get(BASE_URL + '/courses');
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка загрузки курсов',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};

export const getCourseById = async (id: string): Promise<CourseCardType> => {
  try {
    const res = await axios.get(`${BASE_URL}/courses/${id}`, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка загрузки списка тренировок',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};


export const addUserCourse = async (
  { courseId }: courseUserProp,
  token: tokensType,
): Promise<CourseCardType[]> => {
  try {
    const res = await axios.post(
      BASE_URL + RoutesApp.addUserCourse,
      { courseId: courseId },
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token.token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка загрузки курсов',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};


export const delUserCourse = async (
  { courseId }: courseUserProp,
  token: tokensType,
): Promise<CourseCardType[]> => {
  try {
    const res = await axios.delete(
      `${BASE_URL}${RoutesApp.addUserCourse}/${courseId}` ,
     
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token.token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка удаления курса',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};


export const getUserCourse = async (
  token: tokensType,
): Promise<CourseCardType[]> => {
  try {
    const res = await axios.get(BASE_URL + RoutesApp.addUserCourse, {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token.token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка загрузки курсов',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};

export const getCourseWorkout = async (
  id: string,
  token: tokensType,
): Promise<WorkoutType> => {
  try {
    const res = await axios.get(`${BASE_URL}/workouts/${id}`, {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token.token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ?? apiErr.message ?? 'Ошибка загрузки списка тренировок',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};

export const getCourseProgress = async (
  id: string,
  token: tokensType,
): Promise<ApiResponseCourseProgressType> => {
  try {
    const res = await axios.get(
      `${BASE_URL}${RoutesApp.getCourseProgress}${id}`,
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token.token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ??
            apiErr.message ??
            'Ошибка загрузки прогресса по курсу',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};

export const getWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<ApiResponseWorkoutProgressType> => {
  try {
    const res = await axios.get(
      `${BASE_URL}${RoutesApp.getCourseProgress}${courseId}&workoutId=${workoutId}`,
      
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ??
            apiErr.message ??
            'Ошибка загрузки прогресса тренировки',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};

export const updateWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  data: { progressData: number[] },
  token: string,
): Promise<ApiResponseWorkoutProgressType> => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/courses/${courseId}/workouts/${workoutId}`,
      data,
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(
          apiErr.error ??
            apiErr.message ??
            'Ошибка обновления прогресса тренировки',
        );
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
};
// ветка+пр