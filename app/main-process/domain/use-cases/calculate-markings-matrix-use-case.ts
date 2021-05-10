import { matrix, add, multiply, subtract } from 'mathjs';

export interface CalculateMarkingsMatrixUseCase {
  invoke(
    transitionsMatrix: number[],
    consumerMatrix: number[][],
    producerMatrix: number[][],
    markingsMatrix: number[]
  ): number[];
}

export class CalculateMarkingsMatrixUseCaseImpl
  implements CalculateMarkingsMatrixUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(
    transitionsMatrix: number[],
    consumerMatrix: number[][],
    producerMatrix: number[][],
    markingsMatrix: number[]
  ): number[] {
    const transitions = matrix(transitionsMatrix);
    const consumer = matrix(consumerMatrix);
    const producer = matrix(producerMatrix);
    const markings = matrix(markingsMatrix);
    return add(
      multiply(transitions, subtract(producer, consumer)),
      markings
    ).valueOf() as number[];
  }
}
