import { createAction } from '@reduxjs/toolkit';
import { TransitionState } from './transitions.types';

export const setTransition = createAction<TransitionState>(
  'petrinets/transitions/set'
);

export const deleteTransition = createAction<{
  id: string;
}>('petrinets/transitions/delete');
