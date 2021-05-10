import { combineReducers } from '@reduxjs/toolkit';
import { editorReducer } from './editor/editor.reducer';
import { elementsReducer } from './elements/elements.reducer';
import { eventsReducer } from './events/events.reducer';

export const projectReducer = combineReducers({
  elements: elementsReducer,
  editor: editorReducer,
  events: eventsReducer,
});
