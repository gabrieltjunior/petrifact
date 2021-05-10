import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectPlaceById } from '../../redux/project/elements/places/places.selectors';
import { selectElementUseCase } from '../../sagas/editor/editor.actions';
import { updatePlaceUseCase } from '../../sagas/places/places.actions';

interface Props {
  placeId: string;
}

const convertValue = (value: string): number => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    return 0;
  }
  return n;
};

export const PlaceDialog = ({ placeId }: Props) => {
  const place = useSelector(selectPlaceById(placeId));
  const dispatch = useDispatch();
  const [tokens, setTokens] = useState(place.tokens);

  const onClose = () => {
    dispatch(selectElementUseCase(null));
  };

  const onSave = () => {
    dispatch(
      updatePlaceUseCase({
        id: place.id,
        tokens,
      })
    );
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Place</DialogTitle>
      <DialogContent>
        <TextField
          id="place-id"
          label="Id"
          fullWidth
          defaultValue={place.id}
          variant="outlined"
          style={{ marginBottom: '16px' }}
          inputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="place-tokens"
          label="Tokens"
          type="number"
          fullWidth
          defaultValue={tokens}
          variant="outlined"
          style={{ marginBottom: '16px' }}
          onChange={(evt) => setTokens(convertValue(evt.target.value))}
        />
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
