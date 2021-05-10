import { PetriNet } from '../../shared/petrinet';
import { PetriNetRepository } from '../domain/repositories/petri-net-repository';

export class PetriNetInMemoryRepository implements PetriNetRepository {
  private petrinet?: PetriNet;

  private consumerMatrix?: number[][];

  private producerMatrix?: number[][];

  private markings?: number[];

  setPetriNet(petrinet?: PetriNet): void {
    this.petrinet = petrinet;
  }

  getPetriNet(): PetriNet | undefined {
    return this.petrinet;
  }

  setConsumerMatrix(matrix?: number[][]): void {
    this.consumerMatrix = matrix;
  }

  getConsumerMatrix(): number[][] | undefined {
    return this.consumerMatrix;
  }

  setProducerMatrix(matrix?: number[][]): void {
    this.producerMatrix = matrix;
  }

  getProducerMatrix(): number[][] | undefined {
    return this.producerMatrix;
  }

  setMarkings(markings?: number[]): void {
    this.markings = markings;
  }

  getMarkings(): number[] | undefined {
    return this.markings;
  }
}
