import clsx from 'clsx';
import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  className?: string;
  value?: number | string;
}

export default function Input({
  name,
  className,
  type,
  value,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      name={name}
      className={clsx(
        'border border-[#D0CECE] h-[52px] rounded-[10px] px-4.5 py-4 w-full text-black font-normal transition-colors duration-200 placeholder:text-gray-400',
        'bg-white disabled:opacity-50 text-lg',
        type === 'number' && 'appearance-none [MozAppearance:textfield]',
        className,
      )}
      value={isFocused ? value : (value ?? '')}
      placeholder={isFocused ? '' : String(value ?? 0)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}
