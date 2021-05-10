import { ipcRequest } from './ipc-request';

export async function disconnectFromFlexFact(): Promise<undefined> {
  return ipcRequest<undefined>('disconnect-from-flexfact', {});
}
