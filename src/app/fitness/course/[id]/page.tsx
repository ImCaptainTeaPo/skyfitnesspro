'use client';
export const runtime = 'edge'; // для деплоя на cloudfare.com
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useParams } from 'next/navigation';
import CourseDetailed from '@/components/CourseDetailed/CourseDetailed';
import {
  setCurrentCourse,
  setFetchError,
  setFetchIsLoading,
} from '@/store/features/courseSlice';
import { getCourseById } from '@/services/courseApi';
import { toast } from 'react-toastify';

export default function CoursePage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const currentCourse = useAppSelector((state) => state.courses.currentCourse);
  const fetchIsLoading = useAppSelector(
    (state) => state.courses.fetchIsLoading,
  );

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    getCourseById(id)
      .then((course) => {
        if (course) {
          dispatch(setCurrentCourse(course));
        } else {
          dispatch(setFetchError('Курс не найден'));
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          dispatch(setFetchError(error.message));
        } else {
          toast.error('Неизвестная ошибка');
          dispatch(setFetchError('Неизвестная ошибка'));
        }
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
  }, [id, dispatch]);

  if (fetchIsLoading) {
    return <div>Загрузка курса...</div>;
  }

  if (!currentCourse) {
    return <div className="text-red-500">Курс не найден</div>;
  }

  return <CourseDetailed course={currentCourse} />;
}
