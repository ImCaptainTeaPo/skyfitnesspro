export interface CourseCardType {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
    difficulty: string; // 'начальный' | 'средний' | 'сложный';
    order: number;
    durationInDays: number;
    dailyDurationInMinutes: {
      from: number;
      to: number;
    };
    workouts: string[];
  }