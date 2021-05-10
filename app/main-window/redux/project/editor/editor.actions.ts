import { createAction } from '@reduxjs/toolkit';
import { SelectedElement } from './editor.types';

export const setSelectedElement = createAction<SelectedElement>(
  'editor/selected-element/unsafe/set'
);
