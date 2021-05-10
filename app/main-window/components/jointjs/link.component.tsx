import React, { useContext, useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import { CanvasContext } from './paper.context';
import { Cell } from './cell.component';

interface Props {
  id: string;
  weight: number;
  opacity?: number;
  sourceId: string;
  targetId: string;
  events: CellEvents;
}

export const LinkCell: React.FC<Props> = ({
  id,
  weight,
  opacity,
  sourceId,
  targetId,
  events,
}: React.PropsWithChildren<Props>) => {
  const { graph } = useContext(CanvasContext);
  const cell = useRef<joint.shapes.standard.Link>();

  useEffect(() => {
    if (graph?.current && !cell.current) {
      cell.current = new joint.shapes.standard.Link({
        source: { id: sourceId, selector: '.root' },
        target: { id: targetId, selector: '.root' },
        router: { name: 'metro' },
        connector: { name: 'rounded' },
        attrs: {
          line: {
            opacity: opacity ?? 1,
          },
        },
      });
      cell.current.label(0, {
        attrs: {
          text: {
            text: String(weight),
          },
        },
      });
      cell.current.set('id', id);
      cell.current.addTo(graph?.current);
    }
  }, [graph, cell]);

  useEffect(() => {
    cell?.current?.set('id', id);
  }, [id]);

  useEffect(() => {
    cell?.current?.source({ id: sourceId, selector: '.root' });
  }, [sourceId]);

  useEffect(() => {
    cell?.current?.target({ id: targetId, selector: '.root' });
  }, [targetId]);

  useEffect(() => {
    cell?.current?.attr('line/opacity', opacity ?? 1);
  }, [opacity]);

  useEffect(() => {
    cell?.current?.label(0, {
      attrs: {
        text: {
          text: String(weight),
        },
      },
    });
  }, [weight]);

  useEffect(() => {
    return () => {
      graph?.current?.removeCells([cell?.current as joint.dia.Cell]);
    };
  }, [graph, cell]);

  return <Cell id={id} draggable events={events} />;
};
