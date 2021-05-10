import { ipcRequest } from './ipc-request';

export async function connectToFlexFact(): Promise<undefined> {
  return ipcRequest<undefined>('connect-to-flexfact', {});
}
