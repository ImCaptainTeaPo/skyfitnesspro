/* eslint-env jest */

import {
  filterCoursesByIds,
  splitTitleSubtitle,
  cutWorkoutName,
  calculateCourseProgress,
} from './helpers';

describe('filterCoursesByIds', () => {
  it('возвращает только курсы с нужными id', () => {
    const courses = [
      { _id: '1', name: 'Course 1' } as any,
      { _id: '2', name: 'Course 2' } as any,
      { _id: '3', name: 'Course 3' } as any,
    ];

    const result = filterCoursesByIds(courses, ['1', '3']);

    expect(result).toHaveLength(2);
    expect(result.map((c) => c._id)).toEqual(['1', '3']);
  });
});

describe('splitTitleSubtitle', () => {
  it('делит строку по точке на title и subtitle', () => {
    const res = splitTitleSubtitle('Йога. Для начинающих');

    expect(res.title).toBe('Йога');
    expect(res.subtitle).toBe('Для начинающих');
  });

  it('если нет разделителей, возвращает всю строку как title', () => {
    const res = splitTitleSubtitle('Просто заголовок');

    expect(res.title).toBe('Просто заголовок');
    expect(res.subtitle).toBe('');
  });
});

describe('cutWorkoutName', () => {
  it('обрезает всё после скобок', () => {
    const res = cutWorkoutName('Йога (уровень 1)', 100);

    expect(res).toBe('Йога');
  });

  it('обрезает длинные названия и добавляет троеточие', () => {
    const res = cutWorkoutName(
      'Очень длинное название тренировки для проверки обрезки строки',
      35,
    );

    expect(res.endsWith('...')).toBe(true);
    expect(res.length).toBeLessThanOrEqual(38); // 35 + '...'
  });
});

describe('calculateCourseProgress', () => {
  it('считает прогресс курса в процентах', () => {
    const courses = [
      {
        _id: 'course1',
        workouts: [{ _id: 'w1' }, { _id: 'w2' }, { _id: 'w3' }, { _id: 'w4' }],
      } as any,
    ];

    const apiData = {
      workoutsProgress: [
        { workoutId: 'w1', workoutCompleted: true },
        { workoutId: 'w2', workoutCompleted: true },
        { workoutId: 'w3', workoutCompleted: false },
        { workoutId: 'w4', workoutCompleted: false },
      ],
    } as any;

    const progress = calculateCourseProgress('course1', courses, apiData);

    expect(progress).toBe(50); // 2 из 4 = 50%
  });

  it('возвращает 0, если курс не найден или нет тренировок', () => {
    const courses = [{ _id: 'course-without-workouts', workouts: [] } as any];

    const progress1 = calculateCourseProgress('unknown', courses, undefined);
    const progress2 = calculateCourseProgress(
      'course-without-workouts',
      courses,
      undefined,
    );

    expect(progress1).toBe(0);
    expect(progress2).toBe(0);
  });
});
