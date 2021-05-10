import { FlexFactConfig } from '../models/flex-fact-config';
import { ConvertFlexFactConfigUseCaseImpl } from './convert-flex-fact-config-use-case';
// eslint-disable-next-line jest/no-mocks-import
import { mock } from './__mocks__/mock';

describe('convert flex fact config use case', () => {
  it('should convert valid payload into valid configuration', () => {
    const converter = new ConvertFlexFactConfigUseCaseImpl();
    expect(converter.invoke(mock)).toEqual<FlexFactConfig>({
      ip: 'localhost',
      port: 1502,
      inputSignals: {
        start: 0,
        count: 40,
      },
      outputSignals: {
        start: 40,
        count: 20,
      },
      events: [
        {
          name: 'event1',
          type: 'output',
          actions: [
            {
              type: 'clr',
              address: 0,
            },
            {
              type: 'clr',
              address: 1,
            },
            {
              type: 'set',
              address: 0,
            },
            {
              type: 'set',
              address: 1,
            },
          ],
        },
        {
          name: 'event2',
          type: 'input',
          triggers: [
            {
              type: 'positive-edge',
              address: 0,
            },
            {
              type: 'positive-edge',
              address: 1,
            },
            {
              type: 'negative-edge',
              address: 0,
            },
            {
              type: 'negative-edge',
              address: 1,
            },
          ],
        },
      ],
    });
  });
});
