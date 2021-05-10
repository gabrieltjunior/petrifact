// eslint-disable-next-line import/no-cycle
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { projectReducer } from './project/project.reducer';

export const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    project: projectReducer,
  });
};
