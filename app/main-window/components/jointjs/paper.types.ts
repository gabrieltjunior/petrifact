interface PaperEvents {
  onPointerDoubleClick?: (...args: any[]) => void;
  onPointerClick?: (...args: any[]) => void;
  onContextMenu?: (...args: any[]) => void;
  onPointerDown?: (...args: any[]) => void;
  onPointerMove?: (...args: any[]) => void;
  onPointerUp?: (...args: any[]) => void;
  onMouseOver?: (...args: any[]) => void;
  onMouseOut?: (...args: any[]) => void;
  onMouseEnter?: (...args: any[]) => void;
  onMouseLeave?: (...args: any[]) => void;
  onMouseWheel?: (...args: any[]) => void;
}
