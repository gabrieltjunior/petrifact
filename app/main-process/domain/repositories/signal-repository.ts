export interface SignalRepository {
  setSignals(signals?: number[]): void;
  getSignals(): number[] | undefined;
}
