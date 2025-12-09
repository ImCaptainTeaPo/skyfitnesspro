'use client';

import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  getCourseWorkout,
  getCourses,
  updateWorkoutProgress,
  getWorkoutProgress,
} from '@/services/courseApi';
import {
  setCurrentWorkout,
  setCurrentCourse,
  setWorkoutProgress,
} from '@/store/features/courseSlice';
import { setAccessToken } from '@/store/features/authSlice';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { cutWorkoutName } from '@/utils/helpers';
import Button from '@/components/Button/Button';
import { ApiResponseWorkoutProgressType } from '@/types/courseType';
import Input from '@/components/Input/Iinput';
import PopUpApiResult from '@/components/PopUpApiResult/PopUpApiResult';

export default function Workout() {
  const dispatch = useAppDispatch();
  const workout = useAppSelector((state) => state.courses.currentWorkout);
  const currentCourse = useAppSelector((state) => state.courses.currentCourse);
  const token = useAppSelector((state) => state.auth.token);
  const params = useSearchParams();
  const workoutId = params.get('workoutId');
  const courseIdParam = params.get('courseId');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [progressInputs, setProgressInputs] = useState<(number | undefined)[]>(
    [],
  );
  const [initialProgress, setInitialProgress] = useState<number[]>([]);
  const [showPopupResult, setShowPopupResult] = useState(false);

  const workoutProgressData = useAppSelector((state) =>
    currentCourse?._id
      ? state.courses.courseProgress?.[currentCourse._id]?.workouts?.find(
          (w) => w.workoutId === workoutId,
        )
      : undefined,
  );

  useEffect(() => {
    if (!token) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        dispatch(setAccessToken(savedToken));
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (!workoutId || !token) return;

    setLoading(true);

    getCourseWorkout(workoutId, { token })
      .then((workout) => {
        dispatch(setCurrentWorkout(workout));

        return getCourses().then((courses) => {
          let course = courses.find((c) =>
            courseIdParam
              ? c._id === courseIdParam
              : c.workouts.includes(workoutId),
          );
          if (course && workoutId && !course.workouts.includes(workoutId)) {
            const fallback = courses.find((c) =>
              c.workouts.includes(workoutId),
            );
            if (fallback) course = fallback;
          }
          if (course) dispatch(setCurrentCourse(course));
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workoutId, courseIdParam, token, dispatch]);

  useEffect(() => {
    const fetchWorkoutProgress = async () => {
      if (!currentCourse?._id || !workoutId || !token) return;

      try {
        const data: ApiResponseWorkoutProgressType = await getWorkoutProgress(
          currentCourse._id,
          workoutId,
          token,
        );

        dispatch(
          setWorkoutProgress({
            courseId: currentCourse._id,
            workoutId,
            progressData: data.progressData ?? [],
          }),
        );
      } catch (err) {
        if (err instanceof Error) {
          const courses = await getCourses();
          const membershipCourse = courses.find((c) =>
            workoutId ? c.workouts.includes(workoutId) : false,
          );
          if (membershipCourse && membershipCourse._id !== currentCourse?._id) {
            dispatch(setCurrentCourse(membershipCourse));
            try {
              const dataRetry: ApiResponseWorkoutProgressType =
                await getWorkoutProgress(
                  membershipCourse._id,
                  workoutId!,
                  token,
                );
              dispatch(
                setWorkoutProgress({
                  courseId: membershipCourse._id,
                  workoutId: workoutId!,
                  progressData: dataRetry.progressData ?? [],
                }),
              );
              return;
            } catch (retryErr) {
              if (retryErr instanceof Error) {
                toast.error(retryErr.message);
              }
            }
          }
          toast.error(err.message);
        }
      }
    };

    fetchWorkoutProgress();
  }, [currentCourse, workoutId, token, dispatch]);

  const handleOpen = () => {
    const existingProgress = workoutProgressData?.progressData || [];
    setInitialProgress(existingProgress);
    setProgressInputs([]);
    setShowPopup(true);
  };
  const handleInputChange = (index: number, value: string) => {
    const updated = [...progressInputs];
    const maxQty = workout?.exercises?.[index]?.quantity ?? Infinity;
    const isDigitsOnly = /^\d*$/.test(value);
    if (!isDigitsOnly) {
      updated[index] = undefined;
      setProgressInputs(updated);
      return;
    }
    const numeric = value === '' ? undefined : Math.max(0, Number(value));
    updated[index] =
      numeric === undefined ? undefined : Math.min(maxQty, numeric);
    setProgressInputs(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCourse?._id || !workoutId) return;
    const mergedProgress =
      workout?.exercises?.map((ex, i) => {
        const maxQty = ex.quantity;
        const inputValue = progressInputs[i];
        const base =
          inputValue !== undefined ? inputValue : (initialProgress[i] ?? 0);
        return Math.min(maxQty, Math.max(0, base));
      }) ?? [];

    try {
      await updateWorkoutProgress(
        currentCourse._id,
        workoutId,
        { progressData: mergedProgress },
        token,
      );
      dispatch(
        setWorkoutProgress({
          courseId: currentCourse._id,
          workoutId,
          progressData: mergedProgress,
        }),
      );
      setShowPopup(false);
      setShowPopupResult(true);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };
  const hasProgress = workoutProgressData?.progressData?.some(
    (value) => value > 0,
  );
  if (loading)
    return <div className="text-3xl text-center">Загружаем тренировку…</div>;
  if (!workout || !currentCourse)
    return <div className="text-3xl text-center">Нет данных о тренировке</div>;

  return (
    <>
      <div className="flex w-full flex-col gap-10 pt-[60px]">
        <h2 className="text-2xl md:text-6xl font-medium">
          {currentCourse.nameRU}
        </h2>
        <div className="w-full aspect-video">
          <iframe
            src={workout.video}
            width="100%"
            height="100%"
            className="rounded-[30px]"
            loading="lazy"
          />
        </div>
        <div className="p-10 bg-white rounded-[30px]">
          <h3 className="text-[32px] font-normal sm:leading-normal leading-none">
            Упражнения {workout.name}
          </h3>
          <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workout.exercises?.map((ex, i) => {
              const exerciseProgress =
                workoutProgressData?.progressData?.[i] ?? 0;
              const progress = Math.min(
                100,
                Math.round((exerciseProgress / ex.quantity) * 100),
              );

              return (
                <div key={i}>
                  <div className="pb-2.5 text-lg font-normal">
                    {`${cutWorkoutName(ex.name)} (${ex.quantity} раз) ${progress}%`}
                  </div>
                  <ProgressBar progress={progress} />
                </div>
              );
            })}
          </div>
          <div className="pt-10 mx-auto">
            <Button
              text={
                workout.exercises && workout.exercises.length > 0
                  ? hasProgress
                    ? 'Обновить свой прогресс'
                    : 'Заполнить свой прогресс'
                  : 'Отметить как выполненное'
              }
              className="h-12.5 sm:w-80 text-lg w-full"
              onClick={handleOpen}
            />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div
            className="bg-white rounded-[30px] p-10 w-[400px] max-h-[525px] shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[32px] pb-12 font-normal">
              {workout.exercises && workout.exercises.length > 0
                ? 'Мой прогресс'
                : 'Тренировка выполнена'}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-y-auto pr-5 custom-scroll"
            >
              <div className="flex-1 flex-col overflow-y-auto pr-5 custom-scroll">
                <div className="flex flex-col gap-5 pb-6">
                  {workout.exercises?.map((ex, i) => (
                    <div key={i} className="flex flex-col">
                      <label className="text-lg font-normal leading-[110%] pb-2.5">
                        Сколько раз вы сделали {cutWorkoutName(ex.name, 35)}?
                        <span className="text-gray-500">
                          (из {ex.quantity})
                        </span>
                      </label>
                      <Input
                        type="number"
                        placeholder={(initialProgress[i] ?? 0).toString()} // <-- текущий прогресс из API
                        min="0"
                        max={ex.quantity}
                        value={progressInputs[i] ?? ''}
                        onChange={(e) => handleInputChange(i, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" text="Сохранить" className="w-full mt-4" />
            </form>
          </div>
        </div>
      )}

      {showPopupResult && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={() => setShowPopupResult(false)}
        >
          <PopUpApiResult onClose={() => setShowPopupResult(false)} />
        </div>
      )}
    </>
  );
}
