import { ipcRequest } from './ipc-request';

export async function stopPetriNet(): Promise<undefined> {
  return ipcRequest<undefined>('stop-petri-net', {});
}
