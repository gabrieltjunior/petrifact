import { PetriNet } from '../../../shared/petrinet';
import { FlexFactEvent } from '../models/flex-fact-config';
import { CalculateTransitionMatrixUseCaseImpl } from './calculate-transition-matrix-use-case';

describe('calculate transition matrix use case', () => {
  it('should generate transition matrix correctly', () => {
    const event1: FlexFactEvent = {
      name: 'event1',
      type: 'input',
      triggers: [{ address: 0, type: 'negative-edge' }],
    };
    const event2: FlexFactEvent = {
      name: 'event2',
      type: 'input',
      triggers: [{ address: 0, type: 'positive-edge' }],
    };
    const activeTransitions: number[] = [1, 0, 1, 0, 1, 0];
    const petrinet: PetriNet = {
      places: [],
      transitions: [
        { id: 't1' }, // active
        { id: 't2' }, // inactive
        { id: 't3', inputEvent: event1.name }, // active
        { id: 't4', inputEvent: event1.name }, // inactive
        { id: 't5', inputEvent: event2.name }, // active
        { id: 't6', inputEvent: event2.name }, // inactive
      ],
      arcs: [],
    };
    const useCase = new CalculateTransitionMatrixUseCaseImpl();
    expect(useCase.invoke(petrinet, activeTransitions, [])).toEqual([
      1,
      0,
      0,
      0,
      0,
      0,
    ]);
    expect(useCase.invoke(petrinet, activeTransitions, [event1])).toEqual([
      1,
      0,
      1,
      0,
      0,
      0,
    ]);
    expect(useCase.invoke(petrinet, activeTransitions, [event2])).toEqual([
      1,
      0,
      0,
      0,
      1,
      0,
    ]);
    expect(
      useCase.invoke(petrinet, activeTransitions, [event1, event2])
    ).toEqual([1, 0, 1, 0, 1, 0]);
  });
});
