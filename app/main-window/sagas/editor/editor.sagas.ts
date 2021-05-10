import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-cycle
import { selectLinks } from '../../redux/project/elements/links/links.selectors';
import { setPlace } from '../../redux/project/elements/places/places.actions';
// eslint-disable-next-line import/no-cycle
import { selectPlaces } from '../../redux/project/elements/places/places.selectors';
import { setSelectedElement } from '../../redux/project/editor/editor.actions';
import { setLink } from '../../redux/project/elements/links/links.actions';
import { createLinkUseCase } from '../links/links.actions';
import { setEditorState } from '../../redux/project/editor/state/editor-state.actions';
import { setTransition } from '../../redux/project/elements/transitions/transitions.actions';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
// eslint-disable-next-line import/no-cycle
import { selectTransitions } from '../../redux/project/elements/transitions/transitions.selectors';
import {
  createProjectUseCase,
  enterRunModeUseCase,
  leaveRunModeUseCase,
  selectElementUseCase,
  setEditorStateUseCase,
  updateMarkingsUseCase,
} from './editor.actions';
import { importModbusTcpConfig } from '../../services/import-flexfact-config';
import { getConfiguredEvents } from '../../services/get-configured-events';
import { setEvent } from '../../redux/project/events/events.actions';
import { routes } from '../../constants/routes';
import { Event } from '../../../shared/events';
// eslint-disable-next-line import/no-cycle
import { selectEditorState } from '../../redux/project/editor/state/editor-state.selectors';
import { connectToFlexFact } from '../../services/connect-to-flexfact';
import { disconnectFromFlexFact } from '../../services/disconnect-from-flexfact';
import { runPetriNet } from '../../services/run-petri-net';
import { PlacesState } from '../../redux/project/elements/places/places.types';
import { TransitionsState } from '../../redux/project/elements/transitions/transitions.types';
import { LinksState } from '../../redux/project/elements/links/links.types';
import { EditorState } from '../../redux/project/editor/state/editor-state.types';
import { stopPetriNet } from '../../services/stop-petri-net';

function* selectElementSaga(action: ReturnType<typeof selectElementUseCase>) {
  const state: RootState = yield select();
  const editorState = selectEditorState(state);

  const selectedElement = action.payload;

  if (editorState.name === 'editing') {
    if (selectedElement) {
      yield put(
        setSelectedElement({
          entityId: selectedElement.elementId,
          entityType: selectedElement.elementType,
        })
      );
    } else {
      yield put(setSelectedElement(null));
    }
    return;
  }

  if (editorState.name === 'creating-link' && selectedElement === null) {
    yield put(
      setEditorStateUseCase({
        name: 'editing',
        data: undefined,
      })
    );
    return;
  }

  if (editorState.name !== 'creating-link' || !selectedElement) {
    return;
  }

  const links = selectLinks(state);
  const places = selectPlaces(state);
  const transitions = selectTransitions(state);

  let { sourceId, sourceType, targetId, targetType } = editorState.data;
  if (!sourceId) {
    sourceId = selectedElement.elementId;
    sourceType = selectedElement.elementType;
  } else {
    targetId = selectedElement.elementId;
    targetType = selectedElement.elementType;
  }
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

function* createProjectSaga(action: ReturnType<typeof createProjectUseCase>) {
  // TODO clear project
  try {
    const { configFilePath } = action.payload;
    if (configFilePath) {
      yield call(importModbusTcpConfig, configFilePath);
      const events: Event[] = yield call(getConfiguredEvents);
      // eslint-disable-next-line no-restricted-syntax
      for (const evt of events) {
        yield put(setEvent(evt));
      }
    }
    yield put(push(routes.editor));
  } catch (e) {
    yield call(toast.error, e.message);
  }
}

function* leaveRunModeSaga(_: ReturnType<typeof leaveRunModeUseCase>) {
  try {
    yield call(stopPetriNet);
    yield call(disconnectFromFlexFact);
    yield put(
      setEditorStateUseCase({
        name: 'editing',
        data: undefined,
      })
    );
  } catch (e) {
    yield call(toast.error, e.message);
  }
}

function* enterRunModeSaga() {
  try {
    const places: PlacesState = yield select(selectPlaces);
    const transitions: TransitionsState = yield select(selectTransitions);
    const links: LinksState = yield select(selectLinks);
    yield put(
      setEditorStateUseCase({
        name: 'running',
        data: {
          markings: Object.entries(places).reduce<{
            [placeId: string]: number;
          }>((acc, [id, place]) => {
            const result = { ...acc };
            result[id] = place.tokens;
            return result;
          }, {}),
        },
      })
    );
    yield call(connectToFlexFact);
    yield call(runPetriNet, {
      places: Object.entries(places).map(([, place]) => ({
        id: place.id,
        tokens: place.tokens,
      })),
      transitions: Object.entries(transitions).map(([, transition]) => ({
        id: transition.id,
        inputEvent: transition.inputEvent,
        outputEvent: transition.outputEvent,
      })),
      arcs: Object.entries(links).map(([, link]) => ({
        source: link.source,
        target: link.target,
        weight: link.weight,
      })),
    });
  } catch (e) {
    yield call(leaveRunModeSaga, leaveRunModeUseCase());
    yield call(toast.error, e.message);
  }
}

function* updateMarkingsSaga(action: ReturnType<typeof updateMarkingsUseCase>) {
  const editorState: EditorState = yield select(selectEditorState);
  if (editorState.name !== 'running') return;
  yield put(
    setEditorStateUseCase({
      name: 'running',
      data: { markings: action.payload },
    })
  );
}

function* setEditorStateSaga(action: ReturnType<typeof setEditorStateUseCase>) {
  const state: RootState = yield select();
  const editorState = selectEditorState(state);

  if (editorState.name === 'creating-link') {
    const links = selectLinks(state);
    const places = selectPlaces(state);
    const transitions = selectTransitions(state);

    yield all(
      Object.entries(links).map(([_, link]) =>
        put(
          setLink({
            ...link,
            disabled: false,
            selectable: true,
          })
        )
      )
    );

    yield all(
      Object.entries(places).map(([_, place]) =>
        put(
          setPlace({
            ...place,
            disabled: false,
            draggable: true,
            selectable: true,
          })
        )
      )
    );

    yield all(
      Object.entries(transitions).map(([_, transition]) =>
        put(
          setTransition({
            ...transition,
            disabled: false,
            draggable: true,
            selectable: true,
          })
        )
      )
    );
  }

  yield put(setEditorState(action.payload));
}

export function* editorSaga() {
  yield takeLatest(selectElementUseCase.type, selectElementSaga);
  yield takeLatest(createProjectUseCase.type, createProjectSaga);
  yield takeLatest(enterRunModeUseCase.type, enterRunModeSaga);
  yield takeLatest(leaveRunModeUseCase.type, leaveRunModeSaga);
  yield takeLatest(updateMarkingsUseCase.type, updateMarkingsSaga);
  yield takeLatest(setEditorStateUseCase.type, setEditorStateSaga);
}
