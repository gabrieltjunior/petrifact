import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import { CanvasContext, CellEventHandler } from './paper.context';

interface Props {
  events: PaperEvents;
}

export const Paper: React.FC<Props> = ({
  events,
  children,
}: React.PropsWithChildren<Props>) => {
  const container = useRef<HTMLDivElement>(null);
  const [readyToRenderChildren, setReadyToRenderChildren] = useState(false);
  const graph = useRef(new joint.dia.Graph());
  const paper = useRef<joint.dia.Paper>();
  const cellEventHandler = useRef(new CellEventHandler());

  // Set up paper when container is ready
  useEffect(() => {
    if (container?.current) {
      const elem = container.current;
      paper.current = new joint.dia.Paper({
        el: elem,
        width: elem.style.width,
        height: elem.style.height,
        model: graph.current,
        gridSize: 10,
        drawGrid: true,
        clickThreshold: 10,
        background: {
          color: '#f0f1f4',
        },
        defaultConnectionPoint: { name: 'boundary' },
        interactive: (cellView, _) =>
          cellEventHandler.current.isDraggable(String(cellView.model.id)),
      });
      setReadyToRenderChildren(true);
    }
  }, [container]);

  // Set up paper events
  useEffect(() => {
    if (paper?.current) {
      const mapBlankEvent = (
        eventName: string,
        fn?: (...args: any[]) => void
      ) => {
        if (fn) {
          paper?.current?.on(eventName, fn);
        }
      };

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

      mapBlankEvent('blank:pointerdblclick', onPointerDoubleClick);
      mapBlankEvent('blank:pointerclick', onPointerClick);
      mapBlankEvent('blank:contextmenu', onContextMenu);
      mapBlankEvent('blank:pointerdown', onPointerDown);
      mapBlankEvent('blank:pointermove', onPointerMove);
      mapBlankEvent('blank:pointerup', onPointerUp);
      mapBlankEvent('blank:mouseover', onMouseOver);
      mapBlankEvent('blank:mouseout', onMouseOut);
      mapBlankEvent('blank:mouseenter', onMouseEnter);
      mapBlankEvent('blank:mouseleave', onMouseLeave);
      mapBlankEvent('blank:mousewheel', onMouseWheel);
    }
    return () => {
      if (paper?.current) {
        paper.current.off('blank:pointerdblclick');
        paper.current.off('blank:pointerclick');
        paper.current.off('blank:contextmenu');
        paper.current.off('blank:pointerdown');
        paper.current.off('blank:pointermove');
        paper.current.off('blank:pointerup');
        paper.current.off('blank:mouseover');
        paper.current.off('blank:mouseout');
        paper.current.off('blank:mouseenter');
        paper.current.off('blank:mouseleave');
        paper.current.off('blank:mousewheel');
      }
    };
  }, [paper, events]);

  // Set up cell events
  useEffect(() => {
    if (paper?.current) {
      const mapCellEvent = (eventName: string) => {
        paper?.current?.on(eventName, (cellView, ...args) => {
          cellEventHandler.current.call(
            eventName,
            cellView.model.id,
            cellView,
            args
          );
        });
      };
      mapCellEvent('cell:pointerdblclick');
      mapCellEvent('cell:pointerclick');
      mapCellEvent('cell:contextmenu');
      mapCellEvent('cell:pointerdown');
      mapCellEvent('cell:pointermove');
      mapCellEvent('cell:pointerup');
      mapCellEvent('cell:mouseover');
      mapCellEvent('cell:mouseout');
      mapCellEvent('cell:mouseenter');
      mapCellEvent('cell:mouseleave');
      mapCellEvent('cell:mousewheel');
    }
  }, [paper]);

  // Clean up paper
  useEffect(() => {
    return () => {
      paper?.current?.remove();
    };
  }, [paper]);

  // Clean up graph
  useEffect(() => {
    return () => {
      graph?.current?.clear();
    };
  }, [graph]);

  return (
    <div>
      <div
        ref={container}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      {readyToRenderChildren && (
        <CanvasContext.Provider
          value={{
            paper: paper as React.MutableRefObject<joint.dia.Paper>,
            graph,
            cellEventHandler: cellEventHandler.current,
          }}
        >
          {children}
        </CanvasContext.Provider>
      )}
    </div>
  );
};
