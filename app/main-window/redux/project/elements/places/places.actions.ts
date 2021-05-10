import { createAction } from '@reduxjs/toolkit';
import { PlaceState } from './places.types';

export const setPlace = createAction<PlaceState>('petrinets/places/set');

export const deletePlace = createAction<{ id: string }>(
  'petrinets/places/delete'
);
