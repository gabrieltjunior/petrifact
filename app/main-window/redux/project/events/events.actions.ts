import { createAction } from '@reduxjs/toolkit';
import { EventState } from './events.types';

export const setEvent = createAction<EventState>('events/set');

export const deleteEvent = createAction<{
  name: string;
}>('events/delete');
