import { FlexFactEvent } from '../models/flex-fact-config';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';

export interface InterpretEventsFromFlexFactUseCase {
  invoke(prevSignals: number[], newSignals: number[]): FlexFactEvent[];
}

export class InterpretEventsFromFlexFactUseCaseImpl
  implements InterpretEventsFromFlexFactUseCase {
  constructor(private flexFactRepository: FlexFactConfigRepository) {
    this.flexFactRepository = flexFactRepository;
  }

  public invoke(prevSignals: number[], newSignals: number[]): FlexFactEvent[] {
    const config = this.flexFactRepository.getConfig();
    if (typeof config === 'undefined') {
      throw new Error('FlexFact config is not defined.');
    }
    const diffs = newSignals.map(
      (newSignal, index) => newSignal - prevSignals[index]
    );
    return config.events.filter(
      (event) =>
        event.type === 'input' &&
        event.triggers.find(
          ({ type, address }) =>
            (diffs[address] === -1 && type === 'negative-edge') ||
            (diffs[address] === 1 && type === 'positive-edge')
        )
    );
  }
}
