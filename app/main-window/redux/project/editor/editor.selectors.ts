// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../store';

export const selectSelectedElement = (state: RootState) =>
  state.project.editor.selected;
