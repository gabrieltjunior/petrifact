import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { setSelectedElement } from './editor.actions';
import { SelectedElement } from './editor.types';
import { editorStateReducer } from './state/editor-state.reducer';

export const selectedReducer = createReducer<SelectedElement>(
  null,
  (builder) => {
    builder.addCase(setSelectedElement, (_, action) => action.payload);
  }
);

export const editorReducer = combineReducers({
  state: editorStateReducer,
  selected: selectedReducer,
});
