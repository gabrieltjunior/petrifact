export type Place = { id: string; tokens: number };

export type Transition = {
  id: string;
  inputEvent?: string;
  outputEvent?: string;
};

export type Arc = { source: string; target: string; weight: number };

export type PetriNet = {
  places: Place[];
  transitions: Transition[];
  arcs: Arc[];
};
