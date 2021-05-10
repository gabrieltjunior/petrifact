import { createReducer } from '@reduxjs/toolkit';
import { setEditorState } from './editor-state.actions';
import { EditorState } from './editor-state.types';

const initialState: EditorState = {
  name: 'editing',
  data: undefined,
};

export const editorStateReducer = createReducer<EditorState>(
  initialState,
  (builder) => {
    builder.addCase(setEditorState, (_, action) => action.payload);
  }
);
