export type FlexFactConfig = {
  ip: string;
  port: number;
  inputSignals: { start: number; count: number };
  outputSignals: { start: number; count: number };
  events: FlexFactEvent[];
};

export type FlexFactEvent = FlexFactInputEvent | FlexFactOutputEvent;

export type FlexFactInputEvent = {
  name: string;
  type: 'input';
  triggers: FlexFactEventTrigger[];
};

export type FlexFactOutputEvent = {
  name: string;
  type: 'output';
  actions: FlexFactEventAction[];
};

export interface FlexFactEventAction {
  type: 'clr' | 'set';
  address: number;
}

export type FlexFactEventTrigger = {
  type: 'positive-edge' | 'negative-edge';
  address: number;
};
