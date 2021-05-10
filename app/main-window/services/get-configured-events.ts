import { Event } from '../../shared/events';
import { ipcRequest } from './ipc-request';

export async function getConfiguredEvents(): Promise<Event[]> {
  return ipcRequest<Event[]>('get-configured-events', {});
}
