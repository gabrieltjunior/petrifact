export interface Scheduler {
  setInterval(
    fn: (...args: any) => void,
    interval: number,
    ...args: any[]
  ): void;
  clearInterval(): void;
}
