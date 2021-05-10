/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from './constants/routes';
import App from './App';
import { HomePage } from './pages/home-page';
import { EditorPage } from './pages/editor-page';
import { ImportFlexFactConfigPage } from './pages/create-project/import-flex-fact-config-page';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path={routes.home} component={HomePage} />
        <Route
          exact
          path={routes.createProject.importFlexFactConfig}
          component={ImportFlexFactConfigPage}
        />
        <Route exact path={routes.editor} component={EditorPage} />
      </Switch>
    </App>
  );
}
