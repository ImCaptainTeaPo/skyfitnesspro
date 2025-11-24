import Image from 'next/image';

export default function Title() {
  return (
    <div className="pt-12 flex flex-col xl:flex-row justify-between items-center gap-6 xl:gap-0 px-4 xl:px-0">
      <div className="text-left">
        <p className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-black font-medium tracking-normal">
          Начните заниматься спортом
          <br className="hidden sm:block" />и улучшите качество жизни
        </p>
      </div>
      <div className="hidden md:block relative w-48 sm:w-56 md:w-64 xl:w-72 aspect-[288/102]">
        <Image
          src="/img/moto.svg"
          alt="Moto"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
