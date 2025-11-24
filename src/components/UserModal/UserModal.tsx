import Button from '../Button/Button';

interface UserProps {
  email: string;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

export default function UserModal({ email,onProfileClick, onLogoutClick }: UserProps) {
  return (
    <div className="rounded-[30px] bg-white w-[266px] flex flex-col items-center justify-center p-7.5 shadow-lg">
      <div className="pb-8.5 text-center">
        <p className="font-normal text-lg pb-2.5 leading-tight">
          Пользователь:
        </p>
        <p className="text-lg font-normal text-gray-500 leading-tight">
          {email}
        </p>
      </div>
      <div className="flex flex-col gap-2.5 w-full">
        <Button text={'Мой профиль'} className="h-[52px] w-full" onClick={onProfileClick} />
        <Button
          text={'Выйти'}
          className="bg-white border border-black hover:bg-[#F7F7F7]"
          onClick={onLogoutClick}
        />
      </div>
    </div>
  );
}
