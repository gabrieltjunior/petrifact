import { ipcRenderer } from 'electron';
import { IpcResponse, IpcErrorResponse } from '../../shared/ipc-response';

export async function ipcRequest<T>(
  type: string,
  data: Record<string, any>
): Promise<T> {
  const response: IpcResponse<T> | IpcErrorResponse = await ipcRenderer.invoke(
    type,
    data
  );
  if (response.type === 'failure') {
    throw new Error(response.error);
  }
  return response.data;
}
