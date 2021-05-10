// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../../store';
import { LabelState } from './labels.types';

export const selectLabels = (state: RootState) => state.project.elements.labels;

export const selectLabelById = (id: string) => (
  state: RootState
): LabelState => {
  const labels = selectLabels(state);
  return labels[id];
};
