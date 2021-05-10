import { PetriNet } from '../../../shared/petrinet';

export interface PetriNetRepository {
  setPetriNet(petrinet?: PetriNet): void;
  getPetriNet(): PetriNet | undefined;
  setConsumerMatrix(matrix?: number[][]): void;
  getConsumerMatrix(): number[][] | undefined;
  setProducerMatrix(matrix?: number[][]): void;
  getProducerMatrix(): number[][] | undefined;
  setMarkings(markings?: number[]): void;
  getMarkings(): number[] | undefined;
}
