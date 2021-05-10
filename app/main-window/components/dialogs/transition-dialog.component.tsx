import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { selectTransitionById } from '../../redux/project/elements/transitions/transitions.selectors';
import { selectEventsByType } from '../../redux/project/events/events.selectors';
import { updateTransitionUseCase } from '../../sagas/transitions/transitions.actions';
import { selectElementUseCase } from '../../sagas/editor/editor.actions';

interface Props {
  transitionId: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: '100%',
    },
  })
);

export const TransitionDialog = ({ transitionId }: Props) => {
  const classes = useStyles();
  const transition = useSelector(selectTransitionById(transitionId));
  const dispatch = useDispatch();
  const [inputEvent, setInputEvent] = useState(
    transition.inputEvent || '_every-tick'
  );
  const [outputEvent, setOutputEvent] = useState(transition.outputEvent || '');
  const inputEvents = useSelector(selectEventsByType('input'));
  const outputEvents = useSelector(selectEventsByType('output'));

  const onSave = () => {
    dispatch(
      updateTransitionUseCase({
        id: transition.id,
        inputEvent: inputEvent === '_every-tick' ? undefined : inputEvent,
        outputEvent: outputEvent || undefined,
      })
    );
  };

  const onClose = () => {
    dispatch(selectElementUseCase(null));
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Link</DialogTitle>
      <DialogContent>
        <TextField
          id="transition-id"
          label="Id"
          fullWidth
          defaultValue={transition.id}
          variant="outlined"
          style={{ marginBottom: '16px' }}
          inputProps={{
            readOnly: true,
          }}
        />
        <FormControl
          className={classes.formControl}
          variant="outlined"
          style={{ marginBottom: '16px' }}
        >
          <InputLabel id="transition-input-event-label">Input Event</InputLabel>
          <Select
            labelId="transition-input-event-label"
            id="transition-input-event"
            value={inputEvent}
            onChange={(evt) => setInputEvent(evt.target.value as string)}
          >
            <MenuItem value="_every-tick">Every 0.1 seconds</MenuItem>
            {inputEvents.map((event) => (
              <MenuItem key={event.name} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          className={classes.formControl}
          variant="outlined"
          style={{ marginBottom: '16px' }}
        >
          <InputLabel id="transition-output-event-label">
            Output Event
          </InputLabel>
          <Select
            labelId="transition-output-event-label"
            id="transition-output-event"
            value={outputEvent}
            variant="outlined"
            style={{ marginBottom: '16px' }}
            onChange={(evt) => setOutputEvent(evt.target.value as string)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {outputEvents.map((event) => (
              <MenuItem key={event.name} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
