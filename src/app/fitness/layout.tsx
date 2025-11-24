'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/store';
import Header from '@/components/Header/Header';
import AuthModal from '@/components/AuthModal/AuthModal';
import { ToastContainer } from 'react-toastify';
import { setAccessToken, setIsAuth, setUser } from '@/store/features/authSlice';
import { getUserCourses } from '@/services/auth';
import { setFavoriteCourses } from '@/store/features/courseSlice';

interface CourseCardProps {
  children: ReactNode;
}

export default function FitnessLayout({ children }: CourseCardProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setAccessToken(token));
      getUserCourses({ token })
        .then((user) => {
          if (user) {
            dispatch(setUser(user));
            dispatch(setIsAuth(true));
            dispatch(setFavoriteCourses(user.selectedCourses));
          }
        })
        .finally(() => setIsLoading(false));
    } else setIsLoading(false);
  }, [dispatch]);
  return (
    <div className="container mx-auto max-w-screen-xl pt-12 px-4 md:px-10">
      <Header isLoading={isLoading} />
      {children}
      <AuthModal />
      <ToastContainer autoClose={1500} />
    </div>
  );
}
