// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../../store';
import { PlaceState } from './places.types';

export const selectPlaces = (state: RootState) => state.project.elements.places;

export const selectPlaceById = (id: string) => (
  state: RootState
): PlaceState => {
  const places = selectPlaces(state);
  return places[id];
};
