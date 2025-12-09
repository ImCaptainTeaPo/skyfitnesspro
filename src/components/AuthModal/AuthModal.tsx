'use client';
import { useEffect, useState } from 'react';
import { getUserCourses, signIn, signUp } from '@/services/auth';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { closeModal, switchMode } from '@/store/features/modalSlice';
import Button from '@/components/Button/Button';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  setAccessToken,
  setUser,
  setUserName,
  setIsAuth,
} from '@/store/features/authSlice';
import { setFavoriteCourses } from '@/store/features/courseSlice';

export default function AuthModal() {
  const { isOpen, mode } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (mode === 'signup') {
      if (formData.confirmPassword.length > 0) {
        setPasswordMismatch(formData.password !== formData.confirmPassword);
      } else {
        setPasswordMismatch(false);
      }
    }
  }, [formData.password, formData.confirmPassword, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPasswordMismatch(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setPasswordMismatch(true);
          setError('Пароли не совпадают');
          return;
        }

        await signUp({
          email: formData.email,
          password: formData.password,
        });

        const token = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (token) {
          await afterLogin(token);
        }
      } else {
        // Вход
        const token = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (token) {
          await afterLogin(token);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message || 'Что-то пошло не так');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const afterLogin = async (token: { token: string }) => {
    dispatch(setAccessToken(token.token));
    localStorage.setItem('token', token.token);
    dispatch(closeModal());

    const user = await getUserCourses(token);
    if (user) {
      dispatch(setUser(user));
      dispatch(setUserName(user.email));
      dispatch(setIsAuth(true));
      dispatch(setFavoriteCourses(user.selectedCourses));
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
      onClick={() => dispatch(closeModal())}
    >
      <div
        className="bg-white rounded-[30px] p-10 w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Логотип */}
        <div className="pb-12 flex justify-center gap-2.5">
          <Image src="/img/logo.svg" width={18} height={20} alt="Logo" />
          <Image
            src="/img/logo_text.svg"
            width={183}
            height={28}
            alt="SkyFitness"
            className="h-auto w-auto"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2.5 pb-2.5">
            <input
              name="email"
              placeholder="Эл. почта"
              autoComplete="username"
              onChange={handleChange}
              className="border h-[52px] rounded-[10px] px-4.5 py-4 w-full"
            />
            <input
              name="password"
              placeholder="Пароль"
              autoComplete="current-password"
              type="password"
              onChange={handleChange}
              className="border h-[52px] rounded-[10px] px-4.5 py-4 w-full"
            />
            {mode === 'signup' && (
              <input
                name="confirmPassword"
                placeholder="Повторите пароль"
                autoComplete="current-password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`border h-[52px] rounded-[10px] px-4.5 py-4 w-full transition-colors ${
                  passwordMismatch ? 'border-red-500' : ''
                }`}
              />
            )}
          </div>

          <div className="min-h-[20px]">
            {passwordMismatch && (
              <div className="text-red-500 text-xs">Пароли не совпадают</div>
            )}
            {error && <div className="text-red-500 text-xs">{error}</div>}
          </div>
          <div className="pb-6"></div>

          <div className="flex flex-col gap-2.5">
            {mode === 'login' ? (
              <>
                <Button text="Войти" type="submit" disabled={isLoading} />
                <Button
                  text="Зарегистрироваться"
                  onClick={() => dispatch(switchMode('signup'))}
                  className="bg-white border border-black hover:bg-gray-200"
                />
              </>
            ) : (
              <>
                <Button
                  text="Зарегистрироваться"
                  type="submit"
                  disabled={isLoading}
                />
                <Button
                  text="Войти"
                  onClick={() => dispatch(switchMode('login'))}
                  className="bg-white border border-black hover:bg-[#F7F7F7]"
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
