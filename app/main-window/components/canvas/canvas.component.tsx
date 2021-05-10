import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { Places } from './elements/places/places.component';
import { Transitions } from './elements/transitions/transitions.component';
import { Links } from './elements/links/links.component';
import { ContextMenuData } from '../../../shared/context-menu-data';
import { Paper } from '../jointjs/paper.component';
import { createPlaceUseCase } from '../../sagas/places/places.actions';
import { createTransitionUseCase } from '../../sagas/transitions/transitions.actions';
import { selectElementUseCase } from '../../sagas/editor/editor.actions';
import { selectEditorState } from '../../redux/project/editor/state/editor-state.selectors';
import { Labels } from './elements/labels/labels.component';

export const Canvas = () => {
  const dispatch = useDispatch();
  const editorState = useSelector(selectEditorState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onContextMenu = (evt: any, x: any, y: any) => {
    const msg: ContextMenuData = {
      x: evt.pageX,
      y: evt.pageY,
      menuItems: [
        {
          label: 'Add Place',
          action: createPlaceUseCase({ x, y }),
        },
        {
          label: 'Add Transition',
          action: createTransitionUseCase({ x, y }),
        },
        // {
        //   label: 'Add Label',
        //   action: createLabelUseCase({ text: 'New label', x, y }),
        // },
      ],
    };
    ipcRenderer.send('context-menu-called', msg);
  };

  const onPointerClick = () => {
    dispatch(selectElementUseCase(null));
  };

  return (
    <Paper
      events={{
        onContextMenu:
          editorState.name === 'running' ? undefined : onContextMenu,
        onPointerClick:
          editorState.name === 'running' ? undefined : onPointerClick,
      }}
    >
      <Places />
      <Transitions />
      <Links />
      <Labels />
    </Paper>
  );
};
