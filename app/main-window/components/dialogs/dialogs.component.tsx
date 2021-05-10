import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedElement } from '../../redux/project/editor/editor.selectors';
import { LinkDialog } from './link-dialog.component';
import { PlaceDialog } from './place-dialog.component';
import { TransitionDialog } from './transition-dialog.component';

export const Dialogs = () => {
  const selectedElement = useSelector(selectSelectedElement);
  if (!selectedElement) {
    return <></>;
  }
  if (selectedElement.entityType === 'place') {
    return <PlaceDialog placeId={selectedElement.entityId} />;
  }
  if (selectedElement.entityType === 'transition') {
    return <TransitionDialog transitionId={selectedElement.entityId} />;
  }
  if (selectedElement.entityType === 'link') {
    return <LinkDialog linkId={selectedElement.entityId} />;
  }
  return <></>;
};
