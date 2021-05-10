// eslint-disable-next-line import/no-cycle
import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { ThunkAction } from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createRootReducer } from './redux/root.reducer';
// eslint-disable-next-line import/no-cycle
import { rootSaga } from './sagas/root.sagas';

export const history = createHashHistory();
const rootReducer = createRootReducer(history);
export type RootState = ReturnType<typeof rootReducer>;

const router = routerMiddleware(history);
const saga = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), router, saga];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV || ''
);

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState,
  });

  saga.run(rootSaga);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './redux/root.reducer',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('./redux/root.reducer').default)
    );
  }

  return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
