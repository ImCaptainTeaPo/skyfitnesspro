import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('рендерит переданный текст', () => {
    render(<Button text="Начать тренировку" />);

    // Ищем по роли и тексту, как это делает реальный пользователь
    const button = screen.getByRole('button', { name: /начать тренировку/i });

    expect(button).toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const handleClick = jest.fn();

    render(<Button text="Нажми меня" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /нажми меня/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
