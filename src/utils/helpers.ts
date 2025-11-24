import { CourseCardType } from '@/types/courseCard';
import { CourseType, ApiResponseCourseProgressType } from '@/types/courseType';

type Course = CourseCardType;

export function filterCoursesByIds(courses: Course[], ids: string[]): Course[] {
  return courses.filter((course) => ids.includes(course._id));
}

export function splitTitleSubtitle(str: string): {
  title: string;
  subtitle: string;
} {
  const cleanStr = str.trim();

  // Определяем разделитель
  let delimiter = '/';
  if (cleanStr.includes('.')) {
    delimiter = '.';
  } else if (cleanStr.includes('/')) {
    delimiter = '/';
  }

  // Разбиваем и чистим
  const parts = cleanStr
    .split(delimiter)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    title: parts[0] || '',
    subtitle: parts.slice(1, 3).join(` ${delimiter} `) || '',
  };
}



export function cutWorkoutName(str: string, maxLength: number = 35): string {
  let cleanStr = str.trim();

  // 1. Обрезаем всё начиная со скобок
  const bracketIndex = cleanStr.indexOf('(');
  if (bracketIndex !== -1) {
    cleanStr = cleanStr.substring(0, bracketIndex).trim();
  }

  // 2. Если строка длиннее maxLength — обрезаем по слову
  if (cleanStr.length > maxLength) {
    let truncated = cleanStr.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
    return truncated.trim() + '...';
  }

  return cleanStr;
}

export type ApiCourseProgress = {
  courseId: string;
  workouts?: {
    workoutId: string;
    workoutCompleted: boolean;
  }[];
};

export const calculateCourseProgress = (
  courseId: string,
  allCourses: CourseType[],
  apiData?: ApiResponseCourseProgressType,
): number => {
  const course = allCourses.find((c) => c._id === courseId);
  if (!course || !course.workouts || course.workouts.length === 0) return 0;

  const totalWorkouts = course.workouts.length;

  const completedCount =
    apiData?.workoutsProgress?.filter((w) => w.workoutCompleted).length ?? 0;

  return Math.round((completedCount / totalWorkouts) * 100);
};

