import { createReducer } from '@reduxjs/toolkit';
import { deleteLink, setLink } from './links.actions';
import { LinksState, LinkState } from './links.types';

const linkInitialState: LinkState = {
  id: '',
  source: '',
  target: '',
  weight: 0,
  disabled: false,
  selectable: true,
};

export const linkReducer = createReducer<LinkState>(
  linkInitialState,
  (builder) => {
    builder.addCase(setLink, (_, action) => action.payload);
  }
);

const linksInitialState: LinksState = {};

export const linksReducer = createReducer<LinksState>(
  linksInitialState,
  (builder) => {
    builder
      .addCase(setLink, (state, action) => {
        const { id } = action.payload;
        state[id] = linkReducer(state[id], action);
      })
      .addCase(deleteLink, (state, action) => {
        delete state[action.payload.id];
      });
  }
);
