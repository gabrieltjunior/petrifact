import { Arc, PetriNet } from '../../../shared/petrinet';

export interface CalculateProducerMatrixUseCase {
  invoke(petrinet: PetriNet): number[][];
}

export class CalculateProducerMatrixUseCaseImpl
  implements CalculateProducerMatrixUseCase {
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
        (place) => getArcBySourceAndTarget(transition.id, place.id)?.weight || 0
      )
    );
  }
}
