export type LabelState = {
  id: string;
  text: string;
  x: number;
  y: number;
  disabled: boolean;
  draggable: boolean;
  selectable: boolean;
};

export type LabelsState = {
  [id: string]: LabelState;
};
