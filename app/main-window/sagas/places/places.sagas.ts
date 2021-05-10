import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-cycle
import { selectLinksBySourceOrTargetId } from '../../redux/project/elements/links/links.selectors';
import { PlaceState } from '../../redux/project/elements/places/places.types';
import {
  createPlaceUseCase,
  deletePlaceUseCase,
  movePlaceUseCase,
  updatePlaceUseCase,
} from './places.actions';
import {
  deletePlace,
  setPlace,
} from '../../redux/project/elements/places/places.actions';
// eslint-disable-next-line import/no-cycle
import { selectPlaceById } from '../../redux/project/elements/places/places.selectors';
import { setSelectedElement } from '../../redux/project/editor/editor.actions';
import { LinkState } from '../../redux/project/elements/links/links.types';
import { deleteLink } from '../../redux/project/elements/links/links.actions';

function* createPlaceSaga(action: ReturnType<typeof createPlaceUseCase>) {
  const { id, x, y, tokens, disabled, draggable, selectable } = action.payload;
  yield put(
    setPlace({
      id: id ?? uuidv4(),
      x,
      y,
      tokens: tokens ?? 0,
      disabled: disabled ?? false,
      draggable: draggable ?? true,
      selectable: selectable ?? true,
    })
  );
}

function* movePlaceSaga(action: ReturnType<typeof movePlaceUseCase>) {
  const { id, x, y } = action.payload;
  const place: PlaceState = yield select(selectPlaceById(id));
  yield put(setPlace({ ...place, x, y }));
}

function* deletePlaceSaga(action: ReturnType<typeof deletePlaceUseCase>) {
  const { id } = action.payload;
  const links: LinkState[] = yield select(selectLinksBySourceOrTargetId(id));
  yield all(links.map((link) => put(deleteLink({ id: link.id }))));
  yield put(deletePlace(action.payload));
}

function* updatePlaceSaga(action: ReturnType<typeof updatePlaceUseCase>) {
  const { id, tokens } = action.payload;
  if (tokens < 0) {
    yield call(toast.error, 'Token must be equal or greater than 0');
    return;
  }
  const place: PlaceState = yield select(selectPlaceById(id));
  yield put(setPlace({ ...place, tokens }));
  yield put(setSelectedElement(null));
}

export function* placesSaga() {
  yield takeLatest(createPlaceUseCase.type, createPlaceSaga);
  yield takeLatest(movePlaceUseCase.type, movePlaceSaga);
  yield takeLatest(deletePlaceUseCase.type, deletePlaceSaga);
  yield takeLatest(updatePlaceUseCase.type, updatePlaceSaga);
}
