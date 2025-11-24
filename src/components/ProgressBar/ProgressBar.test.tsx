/* eslint-env jest */

import { render } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar component', () => {
  it('рендерит полосу прогресса', () => {
    const { container } = render(<ProgressBar progress={40} />);

    // Ищем внутренний div, который отвечает за прогресс
    const bar = container.querySelector(
      'div > div > div',
    ) as HTMLDivElement | null;

    expect(bar).not.toBeNull();
  });
});
