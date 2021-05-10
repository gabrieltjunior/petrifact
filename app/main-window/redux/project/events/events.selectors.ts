import { RootState } from '../../../store';
import { EventState } from './events.types';

export const selectEvents = (state: RootState) => state.project.events;

export const selectEventsById = (name: string) => (
  state: RootState
): EventState => {
  return selectEvents(state)[name];
};

export const selectEventsByType = (type: 'input' | 'output') => (
  state: RootState
): EventState[] => {
  return Object.entries(selectEvents(state))
    .map(([_, event]) => event)
    .filter((event) => event.type === type);
};
