import React from 'react';

export class CellEventHandler {
  eventHandlers: {
    [eventName: string]: { [id: string]: (...args: any) => void };
  } = {};

  draggableEntities: { [id: string]: boolean } = {};

  add(eventName: string, id: string, handler: (...args: any) => void): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = {};
    }
    this.eventHandlers[eventName][id] = handler;
  }

  remove(eventName: string, id: string): void {
    delete this.eventHandlers?.[eventName]?.[id];
  }

  call(eventName: string, id: string, ...args: any): void {
    this.eventHandlers?.[eventName]?.[id]?.(...args);
  }

  setDraggable(id: string, value: boolean): void {
    this.draggableEntities[id] = value;
  }

  isDraggable(id: string): boolean {
    return this.draggableEntities[id] ?? false;
  }
}

interface Context {
  paper?: React.MutableRefObject<joint.dia.Paper>;
  graph?: React.MutableRefObject<joint.dia.Graph>;
  cellEventHandler: CellEventHandler;
}

export const CanvasContext = React.createContext<Context>({
  cellEventHandler: new CellEventHandler(),
});
