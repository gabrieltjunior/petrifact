import { PetriNet } from '../../../shared/petrinet';
import { FlexFactEvent } from '../models/flex-fact-config';

export interface CalculateTransitionMatrixUseCase {
  invoke(
    petrinet: PetriNet,
    activeTransitions: number[],
    eventsTriggered: FlexFactEvent[]
  ): number[];
}

export class CalculateTransitionMatrixUseCaseImpl
  implements CalculateTransitionMatrixUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(
    petrinet: PetriNet,
    activeTransitions: number[],
    eventsTriggered: FlexFactEvent[]
  ): number[] {
    return petrinet.transitions
      .map<boolean>(
        (transition, index) =>
          activeTransitions[index] === 1 &&
          (typeof transition.inputEvent === 'undefined' ||
            !!eventsTriggered.find(
              (event) => event.name === transition.inputEvent
            ))
      )
      .map<number>((n) => (n ? 1 : 0));
  }
}
