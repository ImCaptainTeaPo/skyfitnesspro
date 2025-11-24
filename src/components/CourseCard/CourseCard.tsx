import Image from 'next/image';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Calendar, Clock, BarChart } from 'lucide-react';
import { CourseCardType } from '@/types/courseCard';
import ProgressBar from '../ProgressBar/ProgressBar';
import Button from '@/components/Button/Button';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { delUserCourse, addUserCourse } from '@/services/courseApi';
import {
  removeFavoriteCourse,
  addFavoriteCourse,
} from '@/store/features/courseSlice';
import { openModal } from '@/store/features/modalSlice';

interface CardsProps {
  course: CourseCardType;
  imageSrc: string;
  priority?: boolean;
  isProgress?: boolean;
  progress?: number;
  onOpenTrainings?: (course: CourseCardType) => void;
  onAuthRequest?: () => void; // открытие модалки авторизации
}

export default function CourseCard({
  course,
  imageSrc,
  priority = false,
  isProgress = false,
  progress = 0,
  onOpenTrainings,
}: CardsProps) {
  const dispatch = useAppDispatch();
  const favoriteCourses = useAppSelector(
    (state) => state.courses.favoriteCourses,
  );
  const token = useAppSelector((state) => state.auth.token);
  const isAuth = !!token;
  const isAdded = favoriteCourses.includes(course._id);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenTrainings?.(course);
  };

  const handleToggleCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      dispatch(openModal('login')); // ← открываем модалку через Redux
      return;
    }

    try {
      if (isAdded) {
        await delUserCourse({ courseId: course._id }, { token });
        dispatch(removeFavoriteCourse(course._id));
        toast.info(`Курс "${course.nameRU}" удален`);
      } else {
        await addUserCourse({ courseId: course._id }, { token });
        dispatch(addFavoriteCourse(course._id));
        toast.success(`Курс "${course.nameRU}" добавлен`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const icon = isAuth ? (isAdded ? '-' : '+') : '+';

  return (
    <Link
      href={`/fitness/course/${course._id}`}
      className="bg-white rounded-[30px] max-h-max shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full sm:w-[360px] transform transition-transform duration-300 hover:scale-[1.03] gap-5"
    >
      <div className="relative w-full h-[325px] rounded-[30px] ">
        <Image
          src={imageSrc}
          alt={course.nameRU}
          fill
          className="object-cover rounded-[30px]"
          priority={priority}
        />
        <div
          onClick={handleToggleCourse}
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-[50%] flex justify-center items-center shadow cursor-[url('/img/cursor_cource.svg'),_auto] hover:bg-gray-100 transition group"
        >
          <span className="text-2xl font-bold text-gray-500 leading-none">
            {icon}
          </span>
          <div className="absolute top-12 right-1 translate-x-1/2 bg-white text-black border border-black rounded-md px-3 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden sm:block">
            {isAdded ? 'Удалить курс' : 'Добавить курс'}
          </div>
        </div>
      </div>

      <div className="px-7.5 pt-6 pb-3.5 flex flex-col gap-5">
        <h2 className="font-medium text-3xl text-black">{course.nameRU}</h2>

        <div className="flex gap-2 text-sm text-gray-700 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar size={16} />
            <span>{course.durationInDays} дней</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Clock size={16} />
            <span>
              {course.dailyDurationInMinutes.from}-
              {course.dailyDurationInMinutes.to} мин/день
            </span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full w-max text-sm text-gray-700">
            <BarChart size={16} color="blue" />
            <span>{course.difficulty}</span>
          </div>
        </div>

        {isProgress && (
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-lg font-normal pb-2.5">
                Прогресс <span>{progress}%</span>
              </p>
              <ProgressBar progress={progress} />
            </div>

            <Button
              text={
                progress === 0
                  ? 'Начать'
                  : progress === 100
                    ? 'Начать заново'
                    : 'Продолжить'
              }
              className="h-12.5 w-full text-lg"
              onClick={handleOpen}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
