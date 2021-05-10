import { Arc, PetriNet } from '../../../shared/petrinet';

export interface CalculateConsumerMatrixUseCase {
  invoke(petrinet: PetriNet): number[][];
}

export class CalculateConsumerMatrixUseCaseImpl
  implements CalculateConsumerMatrixUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(petrinet: PetriNet): number[][] {
    const getArcBySourceAndTarget = (
      source: string,
      target: string
    ): Arc | undefined => {
      return petrinet.arcs.find(
        (arc) => arc.source === source && arc.target === target
      );
    };

    return petrinet.transitions.map<number[]>((transition) =>
      petrinet.places.map<number>(
        (place) => getArcBySourceAndTarget(place.id, transition.id)?.weight || 0
      )
    );
  }
}
