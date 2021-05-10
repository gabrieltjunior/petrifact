export type TransitionState = {
  id: string;
  x: number;
  y: number;
  inputEvent?: string;
  outputEvent?: string;
  disabled: boolean;
  draggable: boolean;
  selectable: boolean;
};

export type TransitionsState = {
  [id: string]: TransitionState;
};
