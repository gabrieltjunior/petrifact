import { PetriNet } from '../../../shared/petrinet';
import { CalculateProducerMatrixUseCaseImpl } from './calculate-producer-matrix-use-case';

describe('calculate producer matrix use case', () => {
  it('should generate producer matrix correctly', () => {
    const petrinet: PetriNet = {
      places: [
        { id: 'p1', tokens: 1 },
        { id: 'p2', tokens: 2 },
        { id: 'p3', tokens: 3 },
      ],
      transitions: [{ id: 't1' }, { id: 't2' }],
      arcs: [
        { source: 'p1', target: 't1', weight: 1 },
        { source: 'p2', target: 't1', weight: 2 },
        { source: 't1', target: 'p3', weight: 3 },
        { source: 'p3', target: 't2', weight: 4 },
        { source: 't2', target: 'p1', weight: 5 },
        { source: 't2', target: 'p3', weight: 6 },
      ],
    };
    const useCase = new CalculateProducerMatrixUseCaseImpl();
    expect(useCase.invoke(petrinet)).toEqual([
      [0, 0, 3],
      [5, 0, 6],
    ]);
  });
});
