import { createAction } from '@reduxjs/toolkit';
import { EditorState } from '../../redux/project/editor/state/editor-state.types';

export const selectElementUseCase = createAction<{
  elementId: string;
  elementType: 'place' | 'transition' | 'link' | 'label';
} | null>('use-case/editor/select-element');

export const createProjectUseCase = createAction<{
  configFilePath?: string;
}>('use-case/editor/create-project');

export const enterRunModeUseCase = createAction(
  'use-case/editor/enter-run-mode'
);

export const leaveRunModeUseCase = createAction(
  'use-case/editor/leave-run-mode'
);

export const updateMarkingsUseCase = createAction<{
  [placeId: string]: number;
}>('use-case/editor/update-markings');

export const setEditorStateUseCase = createAction<EditorState>(
  'use-case/editor/set-editor-state'
);
