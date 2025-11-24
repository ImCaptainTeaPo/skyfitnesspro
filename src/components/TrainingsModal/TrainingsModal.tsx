'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { splitTitleSubtitle } from '@/utils/helpers';
import { useAppDispatch } from '@/store/store';
import { setCurrentWorkout } from '@/store/features/courseSlice';
import { useRouter } from 'next/navigation';
import type { WorkoutType } from '@/types/courseType';
import Button from '../Button/Button';

type TrainingItem = WorkoutType;

interface TrainingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  trainings: TrainingItem[];
  loading?: boolean;
  courseProgress?: {
    [workoutId: string]: { workoutCompleted: boolean };
  } | null;
}

export default function TrainingsModal({
  isOpen,
  onClose,
  title = 'Выберите тренировку',
  trainings,
  loading = false,
  courseProgress = {},
}: TrainingsModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setSelected([]);
  }, [isOpen]);

  if (!isOpen) return null;

  const isWorkoutCompleted = (workoutId: string): boolean => {
    return courseProgress?.[workoutId]?.workoutCompleted ?? false;
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleStart = () => {
    if (!selected.length) return;
    const workout = trainings.find((t) => t._id === selected[0]);
    if (!workout) return;

    dispatch(setCurrentWorkout(workout));
    onClose();
    router.push(`/fitness/workout?workoutId=${workout._id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] w-[450px] p-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pb-11">
          <h2 className="text-[32px] font-normal">{title}</h2>
        </div>

        <div className="max-h-[350px] overflow-y-auto pr-5 custom-scroll">
          {loading && (
            <div className="py-6 text-center text-gray-500">
              Загружаем тренировки…
            </div>
          )}
          {!loading && trainings.length === 0 && (
            <div className="py-6 text-center text-gray-500">Список пуст</div>
          )}

          {!loading &&
            trainings.map((item, idx) => {
              const { title: trainingTitle, subtitle: trainingSubtitle } =
                splitTitleSubtitle(item.name);
              const isCompleted = isWorkoutCompleted(item._id);

              return (
                <div
                  key={item._id ?? `${item.name}-${idx}`}
                  className={clsx(
                    'flex items-start gap-3 py-3 border-b border-gray-200 last:border-none cursor-pointer',
                  )}
                  onClick={() => toggleSelect(item._id)}
                >
                  {/* Чекбокс */}
                  <div
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center border',
                      isCompleted
                        ? 'border-none'
                        : selected.includes(item._id)
                          ? 'bg-gray-400 border-none'
                          : 'border-gray-400 bg-white',
                    )}
                  >
                    {(isCompleted || selected.includes(item._id)) && (
                      <Image
                        src="/img/modals/done.svg"
                        alt="Check"
                        width={26}
                        height={26}
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-2xl font-normal">{trainingTitle}</p>
                    <span className="text-[16px] text-black">
                      {trainingSubtitle || `Тренировка ${idx + 1}`}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <Button
          text={'Начать'}
          className="mt-6 w-full bg-[#BCEC30] rounded-full py-3 text-lg font-medium hover:brightness-95 transition"
          disabled={!selected.length}
          onClick={handleStart}
        />
      </div>
    </div>
  );
}
