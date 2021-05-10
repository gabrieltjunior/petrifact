import { CalculateActiveTransitionsMatrixUseCaseImpl } from './calculate-active-transitions-matrix-use-case';

describe('calculate active transitions matrix use case', () => {
  it('should generate active transitions matrix correctly', () => {
    const consumerMatrix = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 2],
      [1, 1, 2],
      [0, 1, 2],
      [0, 6, 9],
    ];
    const markings = [0, 1, 2];
    const useCase = new CalculateActiveTransitionsMatrixUseCaseImpl();
    expect(useCase.invoke(consumerMatrix, markings)).toEqual([
      1,
      0,
      1,
      1,
      0,
      1,
      0,
    ]);
  });
});
