'use client';

import { useState } from 'react';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Iinput';
import { ExerciseType } from '@/types/courseType';

type WorkoutProgressPopupProps = {
  exercises: ExerciseType[];
  initialProgress: number[];
  onClose: () => void;
  onSubmit: (progressData: number[]) => void;
};

export default function WorkoutProgressPopup({
  exercises,
  initialProgress,
  onSubmit,
}: WorkoutProgressPopupProps) {
  const [progressInputs, setProgressInputs] = useState<(number | undefined)[]>(
    [],
  );

  const handleInputChange = (index: number, value: string) => {
    const updated = [...progressInputs];
    updated[index] = value === '' ? undefined : Math.max(0, Number(value));
    setProgressInputs(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mergedProgress = exercises.map((_, i) =>
      progressInputs[i] !== undefined
        ? progressInputs[i]!
        : (initialProgress[i] ?? 0),
    );
    onSubmit(mergedProgress);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div
        className="bg-white rounded-[30px] p-10 w-[400px] max-h-[525px] shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[32px] pb-12 font-normal">Мой прогресс</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-y-auto pr-5 custom-scroll"
        >
          <div className="flex flex-col gap-5 pb-6">
            {exercises.map((ex, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-lg font-normal leading-[110%] pb-2.5">
                  Сколько раз вы сделали {ex.name}?
                </label>
                <Input
                  type="number"
                  placeholder={(initialProgress[i] ?? 0).toString()}
                  min="0"
                  value={progressInputs[i] ?? ''}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button type="submit" text="Сохранить" className="w-full mt-4" />
        </form>
      </div>
    </div>
  );
}
