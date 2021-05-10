import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';
import { PetriNetRepository } from '../repositories/petri-net-repository';
import { SignalRepository } from '../repositories/signal-repository';
import { ApplyOutputEventsToSignalsUseCase } from './apply-output-events-to-signals-use-case';
import { CalculateActiveTransitionsMatrixUseCaseImpl } from './calculate-active-transitions-matrix-use-case';
import { CalculateMarkingsMatrixUseCase } from './calculate-markings-matrix-use-case';
import { CalculateTransitionMatrixUseCase } from './calculate-transition-matrix-use-case';
import { InterpretEventsFromFlexFactUseCase } from './interpret-events-from-flex-fact-use-case';
import { ReadSignalsFromFlexFactUseCase } from './read-signals-from-flex-fact-use-case';
import { SendMarkingsToRendererUseCase } from './send-markings-to-renderer-use-case';
import { SendSignalsToFlexFactUseCase } from './send-signals-to-flex-fact-use-case';

export interface RunPetriNetStepUseCase {
  invoke(): Promise<void>;
}

export class RunPetriNetStepUseCaseImpl implements RunPetriNetStepUseCase {
  constructor(
    private signalRepository: SignalRepository,
    private petriNetRepository: PetriNetRepository,
    private flexFactConfigRepository: FlexFactConfigRepository,
    private readSignalsFromFlexFactUseCase: ReadSignalsFromFlexFactUseCase,
    private sendSignalsToFlexFactUseCase: SendSignalsToFlexFactUseCase,
    private interpretEventsFromFlexFactUseCase: InterpretEventsFromFlexFactUseCase,
    private calculateActiveTransitionsMatrixUseCaseImpl: CalculateActiveTransitionsMatrixUseCaseImpl,
    private calculateTransitionMatrixUseCase: CalculateTransitionMatrixUseCase,
    private calculateMarkingsMatrixUseCase: CalculateMarkingsMatrixUseCase,
    private applyOutputEventsToSignalsUseCase: ApplyOutputEventsToSignalsUseCase,
    private sendMarkingsToRendererUseCase: SendMarkingsToRendererUseCase
  ) {
    this.signalRepository = signalRepository;
    this.petriNetRepository = petriNetRepository;
    this.readSignalsFromFlexFactUseCase = readSignalsFromFlexFactUseCase;
    this.sendSignalsToFlexFactUseCase = sendSignalsToFlexFactUseCase;
    this.interpretEventsFromFlexFactUseCase = interpretEventsFromFlexFactUseCase;
    this.calculateActiveTransitionsMatrixUseCaseImpl = calculateActiveTransitionsMatrixUseCaseImpl;
    this.calculateTransitionMatrixUseCase = calculateTransitionMatrixUseCase;
    this.calculateMarkingsMatrixUseCase = calculateMarkingsMatrixUseCase;
    this.applyOutputEventsToSignalsUseCase = applyOutputEventsToSignalsUseCase;
    this.sendMarkingsToRendererUseCase = sendMarkingsToRendererUseCase;
  }

  public async invoke(): Promise<void> {
    const petrinet = this.petriNetRepository.getPetriNet();
    if (typeof petrinet === 'undefined') {
      throw new Error('PetriNet is not configured');
    }
    const previousSignals = this.signalRepository.getSignals();
    if (typeof previousSignals === 'undefined') {
      throw new Error('No previous signals found');
    }
    const newSignals = await this.readSignalsFromFlexFactUseCase.invoke();
    this.signalRepository.setSignals(newSignals);
    const eventsTriggered = this.interpretEventsFromFlexFactUseCase.invoke(
      previousSignals,
      newSignals
    );
    const consumerMatrix = this.petriNetRepository.getConsumerMatrix();
    if (typeof consumerMatrix === 'undefined') {
      throw new Error('Consumer Matrix is not set');
    }
    const producerMatrix = this.petriNetRepository.getProducerMatrix();
    if (typeof producerMatrix === 'undefined') {
      throw new Error('Producer Matrix is not set');
    }
    const markings = this.petriNetRepository.getMarkings();
    if (typeof markings === 'undefined') {
      throw new Error('Markings is not set');
    }
    const transitionMatrix = this.calculateTransitionMatrixUseCase.invoke(
      petrinet,
      this.calculateActiveTransitionsMatrixUseCaseImpl.invoke(
        consumerMatrix,
        markings
      ),
      eventsTriggered
    );
    const newMarkings = this.calculateMarkingsMatrixUseCase.invoke(
      transitionMatrix,
      consumerMatrix,
      producerMatrix,
      markings
    );
    this.petriNetRepository.setMarkings(newMarkings);
    const config = this.flexFactConfigRepository.getConfig();
    if (typeof config === 'undefined') {
      throw new Error('FlexFact config is not set');
    }
    const outputSignals = this.applyOutputEventsToSignalsUseCase.invoke(
      petrinet.transitions,
      transitionMatrix,
      config.events
    );
    // this.signalRepository.setSignals(signalsAfterOutputEvents);
    this.sendSignalsToFlexFactUseCase.invoke(outputSignals);
    this.sendMarkingsToRendererUseCase.invoke(petrinet.places, newMarkings);
  }
}
