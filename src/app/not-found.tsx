import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button/Button';


export default function NotFound() {
  return (
    <>

    <div className="flex flex-col gap-[100px]items-center justify-center min-h-screen">

      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-9xl font-bold">404</h1>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-semibold">Страница не найдена</h2>
          <Image
            width={100}
            height={100}
            src="/img/smile_crying.png"
            alt="cry_smile"
          />
        </div>

        <p className="text-2xl text-gray-400 max-w-[400px]">
          Возможно, она была удалена или перенесена на другой адрес
        </p>

        <Link href="/fitness/main">
          <Button text="Вернуться на главную" />
        </Link>
      </div>
    </div>
    </>
  );
}