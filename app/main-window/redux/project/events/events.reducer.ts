import { createReducer } from '@reduxjs/toolkit';
import { deleteEvent, setEvent } from './events.actions';
import { EventState, EventsState } from './events.types';

const eventInitialState: EventState = {
  name: '',
  type: 'input',
};

export const eventReducer = createReducer<EventState>(
  eventInitialState,
  (builder) => {
    builder.addCase(setEvent, (_, action) => action.payload);
  }
);

const eventsInitialState: EventsState = {};

export const eventsReducer = createReducer<EventsState>(
  eventsInitialState,
  (builder) => {
    builder
      .addCase(setEvent, (state, action) => {
        const { name } = action.payload;
        state[name] = eventReducer(state[name], action);
      })
      .addCase(deleteEvent, (state, action) => {
        delete state[action.payload.name];
      });
  }
);
