import React from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { LinkState } from '../../../../redux/project/elements/links/links.types';
import { ContextMenuData } from '../../../../../shared/context-menu-data';
import { LinkCell } from '../../../jointjs/link.component';
import { deleteLink } from '../../../../redux/project/elements/links/links.actions';
import { selectElementUseCase } from '../../../../sagas/editor/editor.actions';
import { selectEditorState } from '../../../../redux/project/editor/state/editor-state.selectors';

interface Props {
  link: LinkState;
}

export const Link = ({ link }: Props) => {
  const editorState = useSelector(selectEditorState);
  const dispatch = useDispatch();

  if (editorState.name === 'running') {
    return (
      <LinkCell
        id={link.id}
        weight={link.weight}
        sourceId={link.source}
        targetId={link.target}
        events={{}}
      />
    );
  }

  const { disabled, selectable } = link;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onContextMenu = (_cellView: any, evt: any) => {
    const msg: ContextMenuData = {
      x: evt.pageX,
      y: evt.pageY,
      menuItems: [
        {
          label: 'Delete Link',
          action: deleteLink({ id: link.id }),
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
            elementId: link.id,
            elementType: 'link',
          })
        );
      };

  return (
    <LinkCell
      id={link.id}
      weight={link.weight}
      opacity={disabled && !selectable ? 0.25 : 1}
      sourceId={link.source}
      targetId={link.target}
      events={{
        onPointerClick,
        onContextMenu,
      }}
    />
  );
};
