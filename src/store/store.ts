import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authSliceReducer } from '@/store/features/authSlice';
import { courseSliceReducer } from './features/courseSlice';
import { authModalSliceReducer } from './features/modalSlice';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      courses: courseSliceReducer,
      auth: authSliceReducer,
      modal: authModalSliceReducer,
    }),
  });
};

// Типы
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Кастомные хуки с типами
export const useAppDispatch: () => AppDispatch = () =>
  useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
