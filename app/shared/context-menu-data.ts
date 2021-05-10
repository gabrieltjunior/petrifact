export type ContextMenuData = {
  x: number;
  y: number;
  menuItems: {
    label: string;
    action: {
      type: string;
      payload: any;
    };
  }[];
};
