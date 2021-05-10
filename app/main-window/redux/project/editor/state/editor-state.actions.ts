import { createAction } from '@reduxjs/toolkit';
import { EditorState } from './editor-state.types';

export const setEditorState = createAction<EditorState>('editor/state/set');
