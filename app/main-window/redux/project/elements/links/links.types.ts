export type LinkState = {
  id: string;
  weight: number;
  source: string;
  target: string;
  disabled: boolean;
  selectable: boolean;
};

export type LinksState = {
  [id: string]: LinkState;
};
