import React, { useContext, useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import { CanvasContext } from './paper.context';
import { Cell } from './cell.component';

interface Props {
  id: string;
  text: string;
  color: string;
  opacity?: number;
  x: number;
  y: number;
  draggable: boolean;
  events: CellEvents;
}

export const LabelCell: React.FC<Props> = ({
  id,
  text,
  color,
  opacity,
  x,
  y,
  draggable,
  events,
}: React.PropsWithChildren<Props>) => {
  const { graph } = useContext(CanvasContext);
  const cell = useRef<joint.shapes.pn.Place>();

  useEffect(() => {
    if (graph?.current && !cell.current) {
      cell.current = new joint.shapes.standard.TextBlock({
        position: { x, y },
        attrs: {
          label: {
            text,
            style: {
              color,
            },
          },
        },
      });
      cell.current.set('id', id);
      cell.current.addTo(graph.current);
    }
  }, [graph, cell]);

  useEffect(() => {
    cell?.current?.set('id', id);
  }, [id]);

  useEffect(() => {
    cell?.current?.attr('label/text', text);
  }, [text]);

  useEffect(() => {
    cell?.current?.position(x, y);
  }, [x, y]);

  useEffect(() => {
    cell?.current?.attr('root/fill', color);
  }, [color]);

  useEffect(() => {
    cell?.current?.attr('root/opacity', opacity ?? 1);
  }, [opacity]);

  useEffect(() => {
    return () => {
      graph?.current?.removeCells([cell?.current as joint.dia.Cell]);
    };
  }, [graph, cell]);

  return <Cell id={id} draggable={draggable} events={events} />;
};
