import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import {
  enterRunModeUseCase,
  leaveRunModeUseCase,
} from '../../sagas/editor/editor.actions';
import { selectEditorState } from '../../redux/project/editor/state/editor-state.selectors';

const useStyles = makeStyles({
  root: {
    width: 300,
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
});

export const Navigator = () => {
  const classes = useStyles();
  const editorState = useSelector(selectEditorState);
  const dispatch = useDispatch();

  return (
    <BottomNavigation
      value={editorState.name === 'running'}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Edit Mode"
        // eslint-disable-next-line react/jsx-boolean-value
        value={false}
        icon={<EditIcon />}
        onClick={() => {
          if (editorState.name === 'running') dispatch(leaveRunModeUseCase());
        }}
      />
      <BottomNavigationAction
        label="Run Mode"
        // eslint-disable-next-line react/jsx-boolean-value
        value={true}
        icon={<PlayCircleFilledIcon />}
        onClick={() => {
          if (editorState.name !== 'running') dispatch(enterRunModeUseCase());
        }}
      />
    </BottomNavigation>
  );
};
