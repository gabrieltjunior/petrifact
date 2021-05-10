// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../../store';
import { TransitionState } from './transitions.types';

export const selectTransitions = (state: RootState) =>
  state.project.elements.transitions;

export const selectTransitionById = (id: string) => (
  state: RootState
): TransitionState => {
  const transitions = selectTransitions(state);
  return transitions[id];
};
