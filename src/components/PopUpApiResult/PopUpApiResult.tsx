import Image from "next/image";
import { useEffect } from 'react';

type PopUpApiResultProps = {
  onClose: () => void;
  autoCloseDelay?: number; 
};

export default function PopUpApiResult({ onClose, autoCloseDelay = 3000 }: PopUpApiResultProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [onClose, autoCloseDelay]);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-[9999]" onClick={onClose}>
        <div
          className="bg-white p-10 w-[400px] max-h-[525px] shadow-lg flex flex-col items-center justify-center rounded-[30px]"
          
        >
          <div className='text-center'>
          <h2 className="text-[40px] pb-8 font-semibold leading-[110%] ">{'Ваш прогресс засчитан'}</h2>
          </div>
         <div>
          <Image
          width={68}
          height={68}
          alt={'Done'}
          src={'/img/modals/successfully.png'}
          className='h-[68px] w-[68px]' />
         </div>

        </div>
      </div>
    )
}