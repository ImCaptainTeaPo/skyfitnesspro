'use client';
import Image from 'next/image';
import Button from '../Button/Button';
import { getImagePath } from '@/utils/getImagePath';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { openModal } from '@/store/features/modalSlice';
import { addUserCourse } from '@/services/courseApi';
import { toast } from 'react-toastify';
import { addFavoriteCourse } from '@/store/features/courseSlice';

interface CourseDetailedProps {
  course: {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
  };
}

export default function CourseDetailed({ course }: CourseDetailedProps) {
  const { isAuth, token } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (!token) return;

    try {
      await addUserCourse({ courseId: course._id }, { token });

      toast.success('Курс добавлен!');
      dispatch(addFavoriteCourse(course._id));
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-[60px] mx-auto overflow-hidden text-white">
        <div className="pt-15">
          <Image
            src={`/img/courses/${getImagePath(course.nameEN)}`}
            alt={course.nameRU}
            width={1120}
            height={310}
            className="w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold lg:text-[40px] sm:text-[24px] text-[24px] text-black pb-10 tracking-normal">
            Подойдет для вас, если:
          </h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between md:h-[100%]">
            {course.fitting.map((text, index) => (
              <div
                key={index}
                className="rounded-[28px] text-sm flex items-center gap-2 w-full  h-36"
                style={{
                  background:
                    'linear-gradient(115.81deg, #151720 34.98%, #1E212E 91.5%)',
                }}
              >
                <div className="p-5 flex flex-row  justify-between gap-5 items-center">
                  <span className="text-[#A1F65E] text-[75px] font-medium">
                    {index + 1}
                  </span>
                  <span className="md:text-2xl sm:text-[18px] font-normal tracking-normal leading-none font-roboto">
                    {text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <p className="font-semibold lg:text-[40px] sm:text-[24px] text-[24px] text-black tracking-normal">
            Направления
          </p>
          <div className="bg-[#BCEC30] rounded-[28px] text-black p-7.5 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm font-medium">
            {course.directions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Image
                  src={'/img/courses/sparcle.svg'}
                  alt="+"
                  width={26}
                  height={26}
                />
                <span className="md:text-2xl text-[18px] sm:text-[18px] font-normal tracking-normal">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-12.5 pt-7 ">
          <div className="absolute w-[350px] h-[337px] right-0 lg:bottom-5 lg:w-[587px] lg:h-[643px] lg:translate-y-70 lg:z-10 xl:translate-y-100 translate-y-[-250px] translate-x-0 z-0">
            <Image
              src="/img/courses/athlete.svg"
              alt="Тренировка"
              fill
              className="object-contain"
            />
          </div>
          <div className="bg-white p-7.5 text-black flex flex-col md:flex-row items-center gap-6 rounded-[30px] relative overflow-visible shadow-[0px_4px_67px_-12px_#00000021] z-0">
            <div className="z-20 max-w-lg flex flex-col gap-7 pt-10 sm:pl-10 ">
              <h3 className="md:text-6xl sm:text-4xl text-[32px] font-medium leading-none z-20">
                Начните путь к новому телу
              </h3>
              <ul className="list-disc list-inside md:text-2xl text-[18px] font-normal text-gray-800 space-y-1 opacity-60 z-20">
                <li>проработка всех групп мышц</li>
                <li>тренировка суставов</li>
                <li>улучшение циркуляции крови</li>
                <li>упражнения заряжают бодростью</li>
                <li>помогают противостоять стрессам</li>
              </ul>
              <div className="pb-10 w-full">
                {isAuth ? (
                  <Button
                    text="Добавить курс"
                    className="px-5 py-2 h-12.5 text-lg w-full"
                    onClick={handleSubmit}
                  />
                ) : (
                  <Button
                    text="Войдите, чтобы добавить курс"
                    className="px-5 py-2 h-12.5 text-sm sm:text-lg w-full"
                    onClick={() => {
                      dispatch(openModal('login'));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
