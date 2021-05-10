import { createAction } from '@reduxjs/toolkit';

export const createTransitionUseCase = createAction<{
  id?: string;
  x: number;
  y: number;
  disabled?: boolean;
  draggable?: boolean;
  selectable?: boolean;
}>('use-case/transitions/create');

export const updateTransitionUseCase = createAction<{
  id: string;
  inputEvent?: string;
  outputEvent?: string;
}>('use-case/transitions/update');

export const moveTransitionUseCase = createAction<{
  id: string;
  x: number;
  y: number;
}>('use-case/transitions/move');

export const deleteTransitionUseCase = createAction<{
  id: string;
}>('use-case/transitions/delete');
