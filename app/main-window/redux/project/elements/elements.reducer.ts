import { combineReducers } from '@reduxjs/toolkit';
import { placesReducer } from './places/places.reducer';
import { linksReducer } from './links/links.reducer';
import { transitionsReducer } from './transitions/transitions.reducer';
import { labelsReducer } from './labels/labels.reducer';

export const elementsReducer = combineReducers({
  places: placesReducer,
  transitions: transitionsReducer,
  links: linksReducer,
  labels: labelsReducer,
});
