'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Image from 'next/image';
import Button from '@/components/Button/Button';
import { clearUser } from '@/store/features/authSlice';
import CourseCard from '@/components/CourseCard/CourseCard';
import TrainingsModal from '@/components/TrainingsModal/TrainingsModal';
import { getImagePath } from '@/utils/getImagePath';
import { filterCoursesByIds, calculateCourseProgress } from '@/utils/helpers';
import {
  getCourses,
  getCourseWorkout,
  getCourseProgress,
  updateWorkoutProgress,
  delUserCourse,
  addUserCourse,
} from '@/services/courseApi';
import {
  setAllCourses,
  setCourseProgress,
  setWorkoutProgress,
} from '@/store/features/courseSlice';
import type { CourseCardType } from '@/types/courseCard';

import { toast } from 'react-toastify';
import { WorkoutType, ApiResponseCourseProgressType } from '@/types/courseType';

type TrainingItem = WorkoutType;

export default function UserProfile() {
  const [modalCourseId, setModalCourseId] = useState<string | null>(null);
  const { allCourses, favoriteCourses, courseProgress } = useAppSelector(
    (state) => state.courses,
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (allCourses.length === 0) {
      getCourses().then((data) => dispatch(setAllCourses(data)));
    }
  }, [allCourses.length, dispatch]);

  const selectedCourses = filterCoursesByIds(allCourses, favoriteCourses);

  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const handleLogoutClick = () => {
    dispatch(clearUser());
    router.push('/fitness/main');
  };

  // ---- modal state ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // открыть модалку для конкретного курса
  const handleOpenTrainings = async (course: CourseCardType) => {
    setModalTitle(course.nameRU);
    setIsModalOpen(true);
    setModalLoading(true);
    setModalCourseId(course._id);

    try {
      const uniqueIds = Array.from(new Set(course.workouts ?? []));
      const data = await Promise.all(
        uniqueIds.map(async (id) => {
          const workout = await getCourseWorkout(id, { token: token });
          return workout;
        }),
      );

      setTrainings(data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);

        setTrainings([]);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetCourseProgress = async (course: CourseCardType) => {
    try {
      try {
        await delUserCourse({ courseId: course._id }, { token });
        await addUserCourse({ courseId: course._id }, { token });
      } catch (err) {
        const uniqueIds = Array.from(new Set(course.workouts ?? []));
        for (const id of uniqueIds) {
          await updateWorkoutProgress(
            course._id,
            id,
            { progressData: [], workoutCompleted: false },
            token,
          );
        }
      }
      dispatch(
        setCourseProgress({
          courseId: course._id,
          workouts: (course.workouts ?? []).map((id) => ({
            workoutId: id,
            workoutCompleted: false,
            progressData: [],
          })),
          progress: 0,
        }),
      );
      await handleOpenTrainings(course);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (favoriteCourses.length > 0 && allCourses.length > 0) {
        for (const courseId of favoriteCourses) {
          try {
            const apiProgress: ApiResponseCourseProgressType =
              await getCourseProgress(courseId, { token });

            const progress = calculateCourseProgress(
              courseId,
              allCourses,
              apiProgress,
            );

            dispatch(
              setCourseProgress({
                courseId,
                workouts: apiProgress.workoutsProgress?.map((w) => ({
                  workoutId: w.workoutId,
                  workoutCompleted: w.workoutCompleted,
                  progressData: w.progressData,
                })),
                progress,
              }),
            );
          } catch (err) {
            if (err instanceof Error) {
              toast.error(err.message);
            }
          }
        }
      }
    };
    fetchProgress();
  }, [favoriteCourses, allCourses, token, dispatch]);
  return (
    <div className="flex flex-col gap-[60px] pt-[60px] pb-64">
      <div>
        <h2 className="font-semibold text-2xl md:text-[40px] pb-10">Профиль</h2>
        <div className="bg-white rounded-[30px]">
          <div className="p-7.5 flex flex-col sm:flex-row gap-8">
            <div className="w-48 md:w-56 aspect-[197/197] relative mx-auto sm:mx-0">
              <Image
                src="/img/user/avatar.svg"
                alt="Avatar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center items-center sm:justify-top items-left">
              <p className="pb-7.5 text-2xl md:text-[32px] font-medium">
                Пользователь:
              </p>
              <span className="lg:text-lg test-[16px] font-normal pb-11">
                Логин: {user?.email}
              </span>
              <Button
                text="Выйти"
                className="bg-white hover:bg-[#F7F7F7] border w-full"
                onClick={handleLogoutClick}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-2xl md:text-[40px]">Мои курсы</h2>
        <div className="pt-10 flex flex-wrap gap-14 w-full">
          {selectedCourses.map((course, index) => (
            <CourseCard
              key={course._id}
              course={course}
              imageSrc={`/img/cards/${getImagePath(course.nameEN)}`}
              priority={index === 0}
              isProgress
              progress={courseProgress[course._id]?.progress ?? 0}
              onOpenTrainings={handleOpenTrainings}
              onResetCourseProgress={handleResetCourseProgress}
            />
          ))}
        </div>
      </div>

      <TrainingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        trainings={trainings}
        loading={modalLoading}
        courseId={modalCourseId}
        courseProgress={
          modalCourseId
            ? courseProgress[modalCourseId]?.workouts?.reduce(
                (acc, w) => ({
                  ...acc,
                  [w.workoutId]: { workoutCompleted: w.workoutCompleted },
                }),
                {},
              )
            : {}
        }
      />
    </div>
  );
}
