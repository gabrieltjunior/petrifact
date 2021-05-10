export type EventState = {
  name: string;
  type: 'input' | 'output';
};

export type EventsState = {
  [name: string]: EventState;
};
