import { fork } from 'redux-saga/effects';
// eslint-disable-next-line import/no-cycle
import { transitionsSaga } from './transitions/transitions.sagas';
// eslint-disable-next-line import/no-cycle
import { placesSaga } from './places/places.sagas';
// eslint-disable-next-line import/no-cycle
import { linksSaga } from './links/links.sagas';
// eslint-disable-next-line import/no-cycle
import { editorSaga } from './editor/editor.sagas';
// eslint-disable-next-line import/no-cycle
import { labelsSaga } from './labels/labels.sagas';

export function* rootSaga() {
  yield fork(transitionsSaga);
  yield fork(placesSaga);
  yield fork(linksSaga);
  yield fork(editorSaga);
  yield fork(labelsSaga);
}
