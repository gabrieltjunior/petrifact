import { SignalRepository } from '../domain/repositories/signal-repository';

export class SignalInMemoryRepository implements SignalRepository {
  private signals?: number[];

  public setSignals(signals?: number[]): void {
    this.signals = signals;
  }

  public getSignals(): number[] | undefined {
    return this.signals;
  }
}
