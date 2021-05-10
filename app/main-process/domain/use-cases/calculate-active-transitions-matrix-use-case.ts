export interface CalculateActiveTransitionsMatrixUseCase {
  invoke(consumerMatrix: number[][], markings: number[]): number[];
}

export class CalculateActiveTransitionsMatrixUseCaseImpl
  implements CalculateActiveTransitionsMatrixUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(consumerMatrix: number[][], markings: number[]): number[] {
    return consumerMatrix.map<number>((preconditions) =>
      preconditions.reduce(
        (acc, precondition, index) => acc && markings[index] >= precondition,
        true
      )
        ? 1
        : 0
    );
  }
}
