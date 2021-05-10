import { createAction } from '@reduxjs/toolkit';
import { LinkState } from './links.types';

export const setLink = createAction<LinkState>('petrinets/links/set');

export const deleteLink = createAction<{ id: string }>(
  'petrinets/links/delete'
);
