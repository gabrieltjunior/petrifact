export type PlaceState = {
  id: string;
  tokens: number;
  x: number;
  y: number;
  disabled: boolean;
  draggable: boolean;
  selectable: boolean;
};

export type PlacesState = {
  [id: string]: PlaceState;
};
