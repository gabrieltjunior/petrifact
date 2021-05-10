import { createReducer } from '@reduxjs/toolkit';
import { deleteTransition, setTransition } from './transitions.actions';
import { TransitionState, TransitionsState } from './transitions.types';

const transitionInitialState: TransitionState = {
  id: '',
  x: 0,
  y: 0,
  disabled: false,
  draggable: true,
  selectable: true,
};

export const transitionReducer = createReducer<TransitionState>(
  transitionInitialState,
  (builder) => {
    builder.addCase(setTransition, (_, action) => action.payload);
  }
);

const transitionsInitialState: TransitionsState = {};

export const transitionsReducer = createReducer<TransitionsState>(
  transitionsInitialState,
  (builder) => {
    builder
      .addCase(setTransition, (state, action) => {
        const { id } = action.payload;
        state[id] = transitionReducer(state[id], action);
      })
      .addCase(deleteTransition, (state, action) => {
        delete state[action.payload.id];
      });
  }
);
