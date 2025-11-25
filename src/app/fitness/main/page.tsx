'use client';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import CourseCard from '@/components/CourseCard/CourseCard';
import { getImagePath } from '@/utils/getImagePath';
import { CourseCardType } from '@/types/courseCard';
import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { getCourses } from '@/services/courseApi';
import {
  setAllCourses,
  setFavoriteCourses,
} from '@/store/features/courseSlice';
import { clearUser } from '@/store/features/authSlice';
import { getUserCourses } from '@/services/auth';

export default function Main() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [courses, setCourses] = useState<CourseCardType[]>([]);

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
      dispatch(setAllCourses(data));
    });

    if (token) {
      getUserCourses({ token })
        .then((userCourses) => {
          dispatch(setFavoriteCourses(userCourses.selectedCourses));
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          {
            dispatch(clearUser());
          }
        });
    } else {
      dispatch(setFavoriteCourses([]));
    }
  }, [dispatch, token]);

  return (
    <>
      <Title />
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-14 pt-12 w-full">
        {courses.map((course, index) => (
          <CourseCard
            key={course._id}
            course={course}
            imageSrc={`/img/cards/${getImagePath(course.nameEN)}`}
            priority
          />
        ))}
      </div>
      <div className="flex justify-center pt-8.5 pb-20">
        <Button
          text="Наверх ↑"
          className="px-4  h-12.5 w-[127px] text-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
    </>
  );
}
