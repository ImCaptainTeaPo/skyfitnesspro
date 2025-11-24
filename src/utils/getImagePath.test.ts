import { getImagePath } from './getImagePath';

describe('getImagePath', () => {
  it('должна возвращать путь в нижнем регистре с расширением .svg', () => {
    expect(getImagePath('Yoga')).toBe('yoga.svg');
    expect(getImagePath('STRETCHING')).toBe('stretching.svg');
  });
});
