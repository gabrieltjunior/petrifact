import { ipcRenderer } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionState } from '../../../../redux/project/elements/transitions/transitions.types';
import { ContextMenuData } from '../../../../../shared/context-menu-data';
import { TransitionCell } from '../../../jointjs/transition.component';
import {
  deleteTransitionUseCase,
  moveTransitionUseCase,
} from '../../../../sagas/transitions/transitions.actions';
import { startCreateLinkUseCase } from '../../../../sagas/links/links.actions';
import { selectElementUseCase } from '../../../../sagas/editor/editor.actions';
import { selectEditorState } from '../../../../redux/project/editor/state/editor-state.selectors';

interface TransitionProps {
  transition: TransitionState;
}

export const Transition = ({ transition }: TransitionProps) => {
  const editorState = useSelector(selectEditorState);
  const dispatch = useDispatch();

  if (editorState.name === 'running') {
    return (
      <TransitionCell
        id={transition.id}
        color="rgb(231,76,60)"
        x={transition.x}
        y={transition.y}
        draggable={false}
        events={{}}
      />
    );
  }

  const { disabled, draggable, selectable } = transition;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPointerUp = !draggable
    ? undefined
    : (cellView: any) => {
        const { model } = cellView;
        dispatch(
          moveTransitionUseCase({
            id: transition.id,
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
                sourceId: transition.id,
                sourceType: 'transition',
              }),
            },
            {
              label: 'Delete Transition',
              action: deleteTransitionUseCase({ id: transition.id }),
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
            elementId: transition.id,
            elementType: 'transition',
          })
        );
      };

  return (
    <TransitionCell
      id={transition.id}
      color="rgb(231,76,60)"
      opacity={disabled && !selectable ? 0.25 : 1}
      x={transition.x}
      y={transition.y}
      draggable={draggable}
      events={{
        onPointerUp,
        onContextMenu,
        onPointerClick,
      }}
    />
  );
};
