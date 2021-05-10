import { createAction } from '@reduxjs/toolkit';

export const createPlaceUseCase = createAction<{
  id?: string;
  tokens?: number;
  x: number;
  y: number;
  disabled?: boolean;
  draggable?: boolean;
  selectable?: boolean;
}>('use-case/places/create');

export const updatePlaceUseCase = createAction<{
  id: string;
  tokens: number;
}>('use-case/places/update');

export const movePlaceUseCase = createAction<{
  id: string;
  x: number;
  y: number;
}>('use-case/places/move');

export const deletePlaceUseCase = createAction<{
  id: string;
}>('use-case/places/delete');
