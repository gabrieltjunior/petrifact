export type RunningStateData = {
  markings: { [placeId: string]: number };
};

export type EditingState = {
  name: 'editing';
  data: undefined;
};

export type CreatingLinkState = {
  name: 'creating-link';
  data: {
    sourceId?: string;
    sourceType?: string;
    targetId?: string;
    targetType?: string;
  };
};

export type RunningState = {
  name: 'running';
  data: {
    markings: { [placeId: string]: number };
  };
};

export type EditorState = EditingState | CreatingLinkState | RunningState;
