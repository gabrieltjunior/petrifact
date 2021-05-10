import { all, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import {
  setTransition,
  deleteTransition,
} from '../../redux/project/elements/transitions/transitions.actions';
import {
  createTransitionUseCase,
  deleteTransitionUseCase,
  moveTransitionUseCase,
  updateTransitionUseCase,
} from './transitions.actions';
import { TransitionState } from '../../redux/project/elements/transitions/transitions.types';
// eslint-disable-next-line import/no-cycle
import { selectTransitionById } from '../../redux/project/elements/transitions/transitions.selectors';
// eslint-disable-next-line import/no-cycle
import { selectLinksBySourceOrTargetId } from '../../redux/project/elements/links/links.selectors';
import { deleteLink } from '../../redux/project/elements/links/links.actions';
import { setSelectedElement } from '../../redux/project/editor/editor.actions';
import { LinkState } from '../../redux/project/elements/links/links.types';

function* createTransitionSaga(
  action: ReturnType<typeof createTransitionUseCase>
) {
  const { id, x, y, disabled, draggable, selectable } = action.payload;
  yield put(
    setTransition({
      id: id ?? uuidv4(),
      x,
      y,
      disabled: disabled ?? false,
      draggable: draggable ?? true,
      selectable: selectable ?? true,
    })
  );
}

function* moveTransitionSaga(action: ReturnType<typeof moveTransitionUseCase>) {
  const { id, x, y } = action.payload;
  const state: RootState = yield select();
  const transition = selectTransitionById(id)(state);
  yield put(setTransition({ ...transition, x, y }));
}

function* deleteTransitionSaga(
  action: ReturnType<typeof deleteTransitionUseCase>
) {
  const { id } = action.payload;
  const links: LinkState[] = yield select(selectLinksBySourceOrTargetId(id));
  yield all(links.map((link) => put(deleteLink({ id: link.id }))));
  yield put(deleteTransition(action.payload));
}

function* updateTransitionSaga(
  action: ReturnType<typeof updateTransitionUseCase>
) {
  const { id, inputEvent, outputEvent } = action.payload;
  const transition: TransitionState = yield select(selectTransitionById(id));
  yield put(setTransition({ ...transition, inputEvent, outputEvent }));
  yield put(setSelectedElement(null));
}

export function* transitionsSaga() {
  yield takeLatest(createTransitionUseCase.type, createTransitionSaga);
  yield takeLatest(moveTransitionUseCase.type, moveTransitionSaga);
  yield takeLatest(deleteTransitionUseCase.type, deleteTransitionSaga);
  yield takeLatest(updateTransitionUseCase.type, updateTransitionSaga);
}
