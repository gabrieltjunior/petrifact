import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-cycle
import {
  selectLinkById,
  selectLinks,
} from '../../redux/project/elements/links/links.selectors';
import { setPlace } from '../../redux/project/elements/places/places.actions';
// eslint-disable-next-line import/no-cycle
import { selectPlaces } from '../../redux/project/elements/places/places.selectors';
import { setSelectedElement } from '../../redux/project/editor/editor.actions';
import { LinkState } from '../../redux/project/elements/links/links.types';
import {
  deleteLink,
  setLink,
} from '../../redux/project/elements/links/links.actions';
import {
  createLinkUseCase,
  deleteLinkUseCase,
  startCreateLinkUseCase,
  updateLinkUseCase,
} from './links.actions';
import { setTransition } from '../../redux/project/elements/transitions/transitions.actions';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
// eslint-disable-next-line import/no-cycle
import { selectTransitions } from '../../redux/project/elements/transitions/transitions.selectors';
import { setEditorStateUseCase } from '../editor/editor.actions';

function* createLinkSaga(action: ReturnType<typeof createLinkUseCase>) {
  const { id, source, target, weight, disabled, selectable } = action.payload;
  yield put(
    setLink({
      id: id ?? uuidv4(),
      source,
      target,
      weight: weight ?? 1,
      disabled: disabled ?? false,
      selectable: selectable ?? true,
    })
  );
}

function* deleteLinkSaga(action: ReturnType<typeof deleteLinkUseCase>) {
  yield put(deleteLink(action.payload));
}

function* startCreateLinkSaga(
  action: ReturnType<typeof startCreateLinkUseCase>
) {
  const state: RootState = yield select();
  const links = selectLinks(state);
  const places = selectPlaces(state);
  const transitions = selectTransitions(state);

  yield call(
    toast.info,
    'Click on a highlighted element to finish creating a link between elements, or click outside to cancel this operation.'
  );

  const { sourceId, sourceType, targetId, targetType } = action.payload;
  const isFinished = !!sourceType && !!targetType;
  const hasPlace = sourceType === 'place' || targetType === 'place';
  const hasTransition =
    sourceType === 'transition' || targetType === 'transition';

  yield all(
    Object.entries(links).map(([_, link]) =>
      put(
        setLink({
          ...link,
          disabled: !isFinished,
          selectable: isFinished,
        })
      )
    )
  );

  yield all(
    Object.entries(places).map(([_, place]) =>
      put(
        setPlace({
          ...place,
          disabled: !isFinished,
          draggable: isFinished,
          selectable: isFinished || !hasPlace,
        })
      )
    )
  );

  yield all(
    Object.entries(transitions).map(([_, transition]) =>
      put(
        setTransition({
          ...transition,
          disabled: !isFinished,
          draggable: isFinished,
          selectable: isFinished || !hasTransition,
        })
      )
    )
  );

  if (isFinished) {
    yield put(
      setEditorStateUseCase({
        name: 'editing',
        data: undefined,
      })
    );
    yield put(
      createLinkUseCase({
        source: sourceId as string,
        target: targetId as string,
      })
    );
    return;
  }

  yield put(
    setEditorStateUseCase({
      name: 'creating-link',
      data: {
        sourceId,
        sourceType,
        targetId,
        targetType,
      },
    })
  );
}

function* updateLinkSaga(action: ReturnType<typeof updateLinkUseCase>) {
  const { id, weight } = action.payload;
  if (weight < 1) {
    yield call(toast.error, 'Weight must be equal or greater than 1');
    return;
  }
  const link: LinkState = yield select(selectLinkById(id));
  yield put(setLink({ ...link, weight }));
  yield put(setSelectedElement(null));
}

export function* linksSaga() {
  yield takeLatest(createLinkUseCase.type, createLinkSaga);
  yield takeLatest(deleteLinkUseCase.type, deleteLinkSaga);
  yield takeLatest(startCreateLinkUseCase.type, startCreateLinkSaga);
  yield takeLatest(updateLinkUseCase.type, updateLinkSaga);
}
