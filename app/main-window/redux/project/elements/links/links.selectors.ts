// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../../store';
import { LinksState, LinkState } from './links.types';

export const selectLinks = (state: RootState): LinksState =>
  state.project.elements.links;

export const selectLinkById = (id: string) => (state: RootState): LinkState => {
  const links = selectLinks(state);
  return links[id];
};

export const selectLinksBySourceOrTargetId = (id: string) => (
  state: RootState
): LinkState[] => {
  const links = selectLinks(state);
  return Object.entries(links)
    .filter(([_, link]) => link.source === id || link.target === id)
    .map(([_, link]) => link);
};
