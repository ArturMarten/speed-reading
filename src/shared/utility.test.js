import { leastSquares } from './utility';

describe('utility', () => {
  it('leastSquares handles null parameters', () => {
    const result = leastSquares(null, null);
    expect(result).toEqual([0, 0, 0]);
  });

  it('leastSquares handles empty arrays', () => {
    const result = leastSquares([], []);
    expect(result).toEqual([0, 0, 0]);
  });

  it('leastSquares handles single element arrays', () => {
    const result = leastSquares([1], [0]);
    expect(result).toEqual([0, 0, 0]);
  });

  it('leastSquares handles two element arrays', () => {
    const result = leastSquares([1, 2], [2, 4]);
    expect(result).toEqual([2, 0, 1]);
  });
});
