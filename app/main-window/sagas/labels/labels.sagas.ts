import { call, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { LabelState } from '../../redux/project/elements/labels/labels.types';
import {
  createLabelUseCase,
  deleteLabelUseCase,
  moveLabelUseCase,
  updateLabelUseCase,
} from './labels.actions';
import {
  deleteLabel,
  setLabel,
} from '../../redux/project/elements/labels/labels.actions';
// eslint-disable-next-line import/no-cycle
import { selectLabelById } from '../../redux/project/elements/labels/labels.selectors';
import { setSelectedElement } from '../../redux/project/editor/editor.actions';

function* createLabelSaga(action: ReturnType<typeof createLabelUseCase>) {
  const { id, text, x, y, disabled, draggable, selectable } = action.payload;
  yield put(
    setLabel({
      id: id ?? uuidv4(),
      text,
      x,
      y,
      disabled: disabled ?? false,
      draggable: draggable ?? true,
      selectable: selectable ?? true,
    })
  );
}

function* moveLabelSaga(action: ReturnType<typeof moveLabelUseCase>) {
  const { id, x, y } = action.payload;
  const label: LabelState = yield select(selectLabelById(id));
  yield put(setLabel({ ...label, x, y }));
}

function* deleteLabelSaga(action: ReturnType<typeof deleteLabelUseCase>) {
  yield put(deleteLabel(action.payload));
}

function* updateLabelSaga(action: ReturnType<typeof updateLabelUseCase>) {
  const { id, text } = action.payload;
  if (!text.trim()) {
    yield call(toast.error, 'Text must not be empty');
    return;
  }
  const label: LabelState = yield select(selectLabelById(id));
  yield put(setLabel({ ...label, text }));
  yield put(setSelectedElement(null));
}

export function* labelsSaga() {
  yield takeLatest(createLabelUseCase.type, createLabelSaga);
  yield takeLatest(moveLabelUseCase.type, moveLabelSaga);
  yield takeLatest(deleteLabelUseCase.type, deleteLabelSaga);
  yield takeLatest(updateLabelUseCase.type, updateLabelSaga);
}
