import { createAction } from '@reduxjs/toolkit';
import { LabelState } from './labels.types';

export const setLabel = createAction<LabelState>('elements/label/set');

export const deleteLabel = createAction<{ id: string }>(
  'elements/label/delete'
);
