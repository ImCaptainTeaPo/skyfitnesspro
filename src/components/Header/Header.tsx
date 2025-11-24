'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { openModal } from '@/store/features/modalSlice';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import UserModal from '../UserModal/UserModal';
import { clearUser, setIsAuth } from '@/store/features/authSlice';

interface HeaderProps {
  isLoading?: boolean;
}
export default function Header({ isLoading = false }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    router.push('/fitness/profile');
  };

  const handleLogoutClick = () => {
    dispatch(clearUser());
    dispatch(setIsAuth(false));
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="container md:px-0 flex items-center justify-between relative">
      <Link href={'/fitness/main'}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2.5">
            <Image
              src="/img/logo.svg"
              height={20}
              width={18}
              alt="SkyLogo"
              className="w-auto h-auto"
            />
            <Image
              src="/img/logo_text.svg"
              height={28}
              width={183}
              alt="SkyFitnessPro"
              className="h-auto w-auto"
            />
          </div>
          <span className="hidden md:block text-sm text-gray-500">
            Онлайн-тренировки для занятий дома
          </span>
        </div>
      </Link>

      {/* Если идет загрузка, не отображаем кнопку и имя пользователя */}
      {!isLoading && (
        <>
          {isAuth && user ? (
            <div className="relative" ref={menuRef}>
              <div
                className="flex gap-4 cursor-pointer"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <Image
                  src="/img/user/profile.svg"
                  alt="profile.svg"
                  width={50}
                  height={50}
                />
                <div className="flex justify-center items-center gap-3">
                  <p className="hidden md:block font-normal text-2xl">
                    {user.email}
                  </p>
                  <Image
                    src="/img/user/expand.svg"
                    width={15}
                    height={15}
                    alt="^"
                    className={`pt-1 transition-transform duration-300 w-auto h-auto ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {isUserMenuOpen && (
                <div className="absolute top-16 right-0 z-50 animate-fadeIn">
                  <UserModal
                    onProfileClick={handleProfileClick}
                    onLogoutClick={handleLogoutClick}
                    email={user.email}
                  />
                </div>
              )}
            </div>
          ) : (
            <Button
              text="Войти"
              className="sm:px-5 py-2 h-9 sm:h-14 w-[83px] sm:w-[103px] sm:text-lg text-[15px] text-center "
              onClick={() => dispatch(openModal('login'))}
            />
          )}
        </>
      )}
    </header>
  );
}
