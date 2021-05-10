import { FlexFactConfig, FlexFactEvent } from '../models/flex-fact-config';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';
import { InterpretEventsFromFlexFactUseCaseImpl } from './interpret-events-from-flex-fact-use-case';

describe('interpret events from flex fact use case', () => {
  it('should return which events were triggered correctly', () => {
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
    const mockRepo: FlexFactConfigRepository = {
      getConfig: jest.fn(
        (): FlexFactConfig => ({
          ip: 'localhost',
          port: 9999,
          signalRange: { start: 0, end: 0 },
          events: [event1, event2],
        })
      ),
      setConfig: jest.fn(),
    };
    const useCase = new InterpretEventsFromFlexFactUseCaseImpl(mockRepo);
    expect(useCase.invoke([0], [0])).toEqual([]);
    expect(useCase.invoke([1], [1])).toEqual([]);
    expect(useCase.invoke([1], [0])).toEqual([event1]);
    expect(useCase.invoke([0], [1])).toEqual([event2]);
  });
});
