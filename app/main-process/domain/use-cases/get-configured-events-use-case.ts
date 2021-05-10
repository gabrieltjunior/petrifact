import { FlexFactEvent } from '../models/flex-fact-config';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';

export interface GetConfiguredEventsUseCase {
  invoke(): FlexFactEvent[];
}

export class GetConfiguredEventsUseCaseImpl
  implements GetConfiguredEventsUseCase {
  constructor(private flexFactConfigRepo: FlexFactConfigRepository) {
    this.flexFactConfigRepo = flexFactConfigRepo;
  }

  public invoke(): FlexFactEvent[] {
    const config = this.flexFactConfigRepo.getConfig();
    if (typeof config === 'undefined') {
      throw new Error('Configuration was not found.');
    }
    return config.events;
  }
}
