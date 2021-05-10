import { createReducer } from '@reduxjs/toolkit';
import { deleteLabel, setLabel } from './labels.actions';
import { LabelState, LabelsState } from './labels.types';

const labelInitialState: LabelState = {
  id: '',
  text: '',
  x: 0,
  y: 0,
  disabled: true,
  draggable: false,
  selectable: false,
};

export const labelReducer = createReducer<LabelState>(
  labelInitialState,
  (builder) => {
    builder.addCase(setLabel, (_, action) => action.payload);
  }
);

const labelsInitialState: LabelsState = {};

export const labelsReducer = createReducer<LabelsState>(
  labelsInitialState,
  (builder) => {
    builder
      .addCase(setLabel, (state, action) => {
        const { id } = action.payload;
        state[id] = labelReducer(state[id], action);
      })
      .addCase(deleteLabel, (state, action) => {
        delete state[action.payload.id];
      });
  }
);
