import { createAction } from '@reduxjs/toolkit';

export const startCreateLinkUseCase = createAction<{
  sourceId?: string;
  sourceType?: 'place' | 'transition';
  targetId?: string;
  targetType?: 'place' | 'transition';
}>('editor/state/start-create-link');

export const createLinkUseCase = createAction<{
  id?: string;
  weight?: number;
  source: string;
  target: string;
  disabled?: boolean;
  selectable?: boolean;
}>('use-case/links/create');

export const updateLinkUseCase = createAction<{
  id: string;
  weight: number;
}>('use-case/links/update');

export const deleteLinkUseCase = createAction<{
  id: string;
}>('use-case/links/delete');
