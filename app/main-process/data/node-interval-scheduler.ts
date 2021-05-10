import { Scheduler } from '../domain/repositories/scheduler';

export class NodeIntervalScheduler implements Scheduler {
  private interval?: ReturnType<typeof setInterval>;

  public setInterval(
    fn: (...args: any[]) => void,
    interval: number,
    ...args: any[]
  ): void {
    if (typeof this.interval !== 'undefined') {
      this.clearInterval();
    }
    this.interval = setInterval(fn, interval, ...args);
  }

  public clearInterval(): void {
    if (typeof this.interval !== 'undefined') {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
