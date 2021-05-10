import React, { useContext, useEffect } from 'react';
import { CanvasContext } from './paper.context';

interface Props {
  id: string;
  draggable: boolean;
  events: CellEvents;
}

export const Cell: React.FC<Props> = ({
  id,
  draggable,
  events,
}: React.PropsWithChildren<Props>) => {
  const { cellEventHandler } = useContext(CanvasContext);
  const {
    onPointerDoubleClick,
    onPointerClick,
    onContextMenu,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onMouseOver,
    onMouseOut,
    onMouseEnter,
    onMouseLeave,
    onMouseWheel,
  } = events;

  const mapEvent = (eventName: string, fn?: (...args: any[]) => void) => {
    if (fn) {
      cellEventHandler.add(eventName, id, fn);
    }
    return () => {
      cellEventHandler.remove(eventName, id);
    };
  };

  useEffect(() => mapEvent('cell:pointerdblclick', onPointerDoubleClick), [
    onPointerDoubleClick,
  ]);
  useEffect(() => mapEvent('cell:pointerclick', onPointerClick), [
    onPointerClick,
  ]);
  useEffect(() => mapEvent('cell:contextmenu', onContextMenu), [
    id,
    onContextMenu,
  ]);
  useEffect(() => mapEvent('cell:pointerdown', onPointerDown), [
    id,
    onPointerDown,
  ]);
  useEffect(() => mapEvent('cell:pointermove', onPointerMove), [
    id,
    onPointerMove,
  ]);
  useEffect(() => mapEvent('cell:pointerup', onPointerUp), [id, onPointerUp]);
  useEffect(() => mapEvent('cell:mouseover', onMouseOver), [id, onMouseOver]);
  useEffect(() => mapEvent('cell:mouseout', onMouseOut), [id, onMouseOut]);
  useEffect(() => mapEvent('cell:mouseenter', onMouseEnter), [
    id,
    onMouseEnter,
  ]);
  useEffect(() => mapEvent('cell:mouseleave', onMouseLeave), [
    id,
    onMouseLeave,
  ]);
  useEffect(() => mapEvent('cell:mousewheel', onMouseWheel), [
    id,
    onMouseWheel,
  ]);
  useEffect(() => cellEventHandler.setDraggable(id, draggable), [
    id,
    draggable,
  ]);

  return <></>;
};
