export interface IpcResponse<T> {
  type: 'success';
  data: T;
}

export interface IpcErrorResponse {
  type: 'failure';
  error: string;
}
