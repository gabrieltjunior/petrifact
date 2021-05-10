import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import { history, configuredStore } from './main-window/store';
import './app.global.css';
import { Place } from './shared/petrinet';
import { updateMarkingsUseCase } from './main-window/sagas/editor/editor.actions';

const store = configuredStore();

ipcRenderer.on('dispatch', (_, data) => {
  store.dispatch(data);
});

ipcRenderer.on('update-tokens', (_, places: Place[]) => {
  store.dispatch(
    updateMarkingsUseCase(
      places.reduce<{ [placeId: string]: number }>((acc, place) => {
        const result = { ...acc };
        result[place.id] = place.tokens;
        return result;
      }, {})
    )
  );
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./main-window/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
