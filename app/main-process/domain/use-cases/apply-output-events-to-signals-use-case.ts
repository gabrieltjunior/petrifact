import { Transition } from '../../../shared/petrinet';
import { FlexFactEvent } from '../models/flex-fact-config';

export interface ApplyOutputEventsToSignalsUseCase {
  invoke(
    transitions: Transition[],
    transitionsMatrix: number[],
    events: FlexFactEvent[]
  ): { address: number; value: number }[];
}

export class ApplyOutputEventsToSignalsUseCaseImpl
  implements ApplyOutputEventsToSignalsUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(
    transitions: Transition[],
    transitionsMatrix: number[],
    events: FlexFactEvent[]
  ): { address: number; value: number }[] {
    const result: { address: number; value: number }[] = [];
    transitions.forEach((transition, index) => {
      if (transitionsMatrix[index] === 0) return;
      if (typeof transition.outputEvent === 'undefined') return;
      const event = events.find(({ name }) => transition.outputEvent === name);
      if (typeof event === 'undefined') return; // TODO throw exception
      if (event.type !== 'output') return; // TODO throw exception
      event.actions.forEach((action) => {
        result.push({
          address: action.address,
          value: action.type === 'set' ? 1 : 0,
        });
      });
    });
    return result;
  }
}
