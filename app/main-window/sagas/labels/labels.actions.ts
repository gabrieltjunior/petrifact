import { createAction } from '@reduxjs/toolkit';

export const createLabelUseCase = createAction<{
  id?: string;
  text: string;
  x: number;
  y: number;
  disabled?: boolean;
  draggable?: boolean;
  selectable?: boolean;
}>('use-case/labels/create');

export const updateLabelUseCase = createAction<{
  id: string;
  text: string;
}>('use-case/labels/update');

export const moveLabelUseCase = createAction<{
  id: string;
  x: number;
  y: number;
}>('use-case/labels/move');

export const deleteLabelUseCase = createAction<{
  id: string;
}>('use-case/labels/delete');
