// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../../store';

export const selectEditorState = (state: RootState) =>
  state.project.editor.state;
