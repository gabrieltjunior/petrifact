import { createReducer } from '@reduxjs/toolkit';
import { deletePlace, setPlace } from './places.actions';
import { PlaceState, PlacesState } from './places.types';

const placeInitialState: PlaceState = {
  id: '',
  tokens: 0,
  x: 0,
  y: 0,
  disabled: false,
  draggable: true,
  selectable: true,
};

export const placeReducer = createReducer<PlaceState>(
  placeInitialState,
  (builder) => {
    builder.addCase(setPlace, (_, action) => action.payload);
  }
);

const placesInitialState: PlacesState = {};

export const placesReducer = createReducer<PlacesState>(
  placesInitialState,
  (builder) => {
    builder
      .addCase(setPlace, (state, action) => {
        const { id } = action.payload;
        state[id] = placeReducer(state[id], action);
      })
      .addCase(deletePlace, (state, action) => {
        delete state[action.payload.id];
      });
  }
);
