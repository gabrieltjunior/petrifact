import { ipcRequest } from './ipc-request';

export async function importModbusTcpConfig(
  filePath: string
): Promise<undefined> {
  return ipcRequest<undefined>('import-modbus-tcp-config', { filePath });
}
