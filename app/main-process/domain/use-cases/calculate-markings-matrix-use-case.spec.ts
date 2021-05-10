import { CalculateMarkingsMatrixUseCaseImpl } from './calculate-markings-matrix-use-case';

describe('calculate markings matrix use case', () => {
  it('should generate new markings correctly', () => {
    const transitionsMatrix = [0, 1, 1, 0];
    const consumerMatrix = [
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0],
    ];
    const producerMatrix = [
      [1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
    ];
    const markingsMatrix = [2, 1, 0, 0, 0];
    const useCase = new CalculateMarkingsMatrixUseCaseImpl();
    expect(
      useCase.invoke(
        transitionsMatrix,
        consumerMatrix,
        producerMatrix,
        markingsMatrix
      )
    ).toEqual([1, 0, 1, 2, 0]);
  });
});
