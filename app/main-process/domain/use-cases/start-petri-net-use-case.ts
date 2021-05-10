import { PetriNet } from '../../../shared/petrinet';
import { PetriNetRepository } from '../repositories/petri-net-repository';
import { Scheduler } from '../repositories/scheduler';
import { SignalRepository } from '../repositories/signal-repository';
import { CalculateConsumerMatrixUseCase } from './calculate-consumer-matrix-use-case';
import { CalculateProducerMatrixUseCase } from './calculate-producer-matrix-use-case';
import { ReadSignalsFromFlexFactUseCase } from './read-signals-from-flex-fact-use-case';
import { RunPetriNetStepUseCase } from './run-petri-net-step-use-case';

export interface StartPetriNetUseCase {
  invoke(petrinet: PetriNet): Promise<void>;
}

export class StartPetriNetUseCaseImpl implements StartPetriNetUseCase {
  constructor(
    private petriNetRepository: PetriNetRepository,
    private signalRepository: SignalRepository,
    private calculateConsumerMatrixUseCase: CalculateConsumerMatrixUseCase,
    private calculateProducerMatrixUseCase: CalculateProducerMatrixUseCase,
    private readSignalsFromFlexFactUseCase: ReadSignalsFromFlexFactUseCase,
    private scheduler: Scheduler,
    private runPetriNetStepUseCase: RunPetriNetStepUseCase
  ) {
    this.petriNetRepository = petriNetRepository;
    this.calculateConsumerMatrixUseCase = calculateConsumerMatrixUseCase;
    this.calculateProducerMatrixUseCase = calculateProducerMatrixUseCase;
    this.signalRepository = signalRepository;
    this.readSignalsFromFlexFactUseCase = readSignalsFromFlexFactUseCase;
    this.scheduler = scheduler;
    this.runPetriNetStepUseCase = runPetriNetStepUseCase;
  }

  public async invoke(petrinet: PetriNet): Promise<void> {
    this.petriNetRepository.setPetriNet(petrinet);
    this.petriNetRepository.setConsumerMatrix(
      this.calculateConsumerMatrixUseCase.invoke(petrinet)
    );
    this.petriNetRepository.setProducerMatrix(
      this.calculateProducerMatrixUseCase.invoke(petrinet)
    );
    this.petriNetRepository.setMarkings(
      petrinet.places.map((place) => place.tokens)
    );
    this.signalRepository.setSignals(
      await this.readSignalsFromFlexFactUseCase.invoke()
    );
    this.scheduler.setInterval(
      (runPetriNetStepUseCase) => {
        runPetriNetStepUseCase.invoke();
      },
      50,
      this.runPetriNetStepUseCase
    );
  }
}
