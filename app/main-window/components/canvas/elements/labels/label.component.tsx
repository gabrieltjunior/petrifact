import React from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { ContextMenuData } from '../../../../../shared/context-menu-data';
import { selectElementUseCase } from '../../../../sagas/editor/editor.actions';
import { selectEditorState } from '../../../../redux/project/editor/state/editor-state.selectors';
import { LabelState } from '../../../../redux/project/elements/labels/labels.types';
import {
  deleteLabelUseCase,
  moveLabelUseCase,
} from '../../../../sagas/labels/labels.actions';
import { LabelCell } from '../../../jointjs/label.component';

interface Props {
  label: LabelState;
}

export const Label = ({ label }: Props) => {
  const editorState = useSelector(selectEditorState);
  const dispatch = useDispatch();

  if (editorState.name === 'running') {
    return (
      <LabelCell
        id={label.id}
        text={label.text}
        color="black"
        x={label.x}
        y={label.y}
        draggable={false}
        events={{}}
      />
    );
  }

  const { disabled, draggable, selectable } = label;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPointerUp = !draggable
    ? undefined
    : (cellView: any) => {
        const { model } = cellView;
        dispatch(
          moveLabelUseCase({
            id: label.id,
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
              label: 'Delete Label',
              action: deleteLabelUseCase({ id: label.id }),
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
            elementId: label.id,
            elementType: 'label',
          })
        );
      };

  return (
    <LabelCell
      id={label.id}
      text={label.text}
      color="black"
      opacity={disabled && !selectable ? 0.25 : 1}
      x={label.x}
      y={label.y}
      draggable={draggable}
      events={{
        onPointerUp,
        onContextMenu,
        onPointerClick,
      }}
    />
  );
};
