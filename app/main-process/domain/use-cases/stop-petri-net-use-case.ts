import { PetriNetRepository } from '../repositories/petri-net-repository';
import { Scheduler } from '../repositories/scheduler';
import { SignalRepository } from '../repositories/signal-repository';

export interface StopPetriNetUseCase {
  invoke(): void;
}

export class StopPetriNetUseCaseImpl implements StopPetriNetUseCase {
  constructor(
    private petriNetRepository: PetriNetRepository,
    private signalRepository: SignalRepository,
    private scheduler: Scheduler
  ) {
    this.petriNetRepository = petriNetRepository;
    this.signalRepository = signalRepository;
    this.scheduler = scheduler;
  }

  public invoke(): void {
    this.petriNetRepository.setPetriNet(undefined);
    this.petriNetRepository.setConsumerMatrix(undefined);
    this.petriNetRepository.setProducerMatrix(undefined);
    this.petriNetRepository.setMarkings(undefined);
    this.signalRepository.setSignals(undefined);
    this.scheduler.clearInterval();
  }
}
