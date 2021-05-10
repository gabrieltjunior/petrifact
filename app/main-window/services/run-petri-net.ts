import { PetriNet } from '../../shared/petrinet';
import { ipcRequest } from './ipc-request';

export async function runPetriNet(petrinet: PetriNet): Promise<undefined> {
  return ipcRequest<undefined>('run-petri-net', petrinet);
}
