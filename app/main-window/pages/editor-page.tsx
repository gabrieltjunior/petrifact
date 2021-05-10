import React from 'react';
import { Canvas } from '../components/canvas/canvas.component';
import { Dialogs } from '../components/dialogs/dialogs.component';
import { Navigator } from '../components/navigator/navigator.component';

export const EditorPage = () => {
  return (
    <>
      <Dialogs />
      <Canvas />
      <Navigator />
    </>
  );
};
