import React from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { PlaceState } from '../../../../redux/project/elements/places/places.types';
import { ContextMenuData } from '../../../../../shared/context-menu-data';
import { PlaceCell } from '../../../jointjs/place.component';
import {
  deletePlaceUseCase,
  movePlaceUseCase,
} from '../../../../sagas/places/places.actions';
import { startCreateLinkUseCase } from '../../../../sagas/links/links.actions';
import { selectElementUseCase } from '../../../../sagas/editor/editor.actions';
import { selectEditorState } from '../../../../redux/project/editor/state/editor-state.selectors';

interface PlaceProps {
  place: PlaceState;
}

export const Place = ({ place }: PlaceProps) => {
  const editorState = useSelector(selectEditorState);
  const dispatch = useDispatch();

  if (editorState.name === 'running') {
    return (
      <PlaceCell
        id={place.id}
        tokens={editorState.data.markings[place.id]}
        color="rgb(231,76,60)"
        x={place.x}
        y={place.y}
        draggable={false}
        events={{}}
      />
    );
  }

  const { disabled, draggable, selectable } = place;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPointerUp = !draggable
    ? undefined
    : (cellView: any) => {
        const { model } = cellView;
        dispatch(
          movePlaceUseCase({
            id: place.id,
            x: model.attributes.position.x,
            y: model.attributes.position.y,
          })
        );
      };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onContextMenu = disabled
    ? undefined
    : (_cellView: any, evt: any) => {
        const msg: ContextMenuData = {
          x: evt.pageX,
          y: evt.pageY,
          menuItems: [
            {
              label: 'Create Link',
              action: startCreateLinkUseCase({
                sourceId: place.id,
                sourceType: 'place',
              }),
            },
            {
              label: 'Delete Place',
              action: deletePlaceUseCase({ id: place.id }),
            },
          ],
        };
        ipcRenderer.send('context-menu-called', msg);
      };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPointerClick = !selectable
    ? undefined
    : () => {
        dispatch(
          selectElementUseCase({
            elementId: place.id,
            elementType: 'place',
          })
        );
      };

  return (
    <PlaceCell
      id={place.id}
      tokens={place.tokens}
      color="rgb(231,76,60)"
      opacity={disabled && !selectable ? 0.25 : 1}
      x={place.x}
      y={place.y}
      draggable={draggable}
      events={{
        onPointerUp,
        onContextMenu,
        onPointerClick,
      }}
    />
  );
};
