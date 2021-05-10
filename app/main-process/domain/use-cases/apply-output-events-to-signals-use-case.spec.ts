import { Transition } from '../../../shared/petrinet';
import { FlexFactEvent } from '../models/flex-fact-config';
import { ApplyOutputEventsToSignalsUseCaseImpl } from './apply-output-events-to-signals-use-case';

describe('interpret events from flex fact use case', () => {
  it('should return which events were triggered correctly', () => {
    const transitions: Transition[] = [
      { id: 't1' },
      { id: 't2', outputEvent: 'event1' },
      { id: 't3', outputEvent: 'event2' },
    ];
    const events: FlexFactEvent[] = [
      {
        name: 'event1',
        type: 'output',
        actions: [{ address: 0, type: 'clr' }],
      },
      {
        name: 'event2',
        type: 'output',
        actions: [{ address: 0, type: 'set' }],
      },
    ];
    const useCase = new ApplyOutputEventsToSignalsUseCaseImpl();
    expect(useCase.invoke(transitions, [0, 0, 0], events)).toEqual([]);
    expect(useCase.invoke(transitions, [1, 0, 0], events)).toEqual([]);
    expect(useCase.invoke(transitions, [0, 1, 0], events)).toEqual([
      { address: 0, value: 0 },
    ]);
    expect(useCase.invoke(transitions, [0, 0, 1], events)).toEqual([
      { address: 0, value: 1 },
    ]);
    expect(useCase.invoke(transitions, [0, 1, 1], events)).toEqual([
      { address: 0, value: 0 },
      { address: 0, value: 1 },
    ]);
  });
});
