import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectLinkById } from '../../redux/project/elements/links/links.selectors';
import { selectElementUseCase } from '../../sagas/editor/editor.actions';
import { updateLinkUseCase } from '../../sagas/links/links.actions';

interface Props {
  linkId: string;
}

const convertValue = (value: string): number => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    return 1;
  }
  return n;
};

export const LinkDialog = ({ linkId }: Props) => {
  const link = useSelector(selectLinkById(linkId));
  const dispatch = useDispatch();
  const [weight, setWeight] = useState(link.weight);

  const onClose = () => {
    dispatch(selectElementUseCase(null));
  };

  const onSave = () => {
    dispatch(
      updateLinkUseCase({
        id: link.id,
        weight,
      })
    );
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Link</DialogTitle>
      <DialogContent>
        <TextField
          id="link-id"
          label="Id"
          fullWidth
          defaultValue={link.id}
          variant="outlined"
          style={{ marginBottom: '16px' }}
          inputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="link-weight"
          label="Weight"
          type="number"
          fullWidth
          defaultValue={weight}
          variant="outlined"
          style={{ marginBottom: '16px' }}
          onChange={(evt) => setWeight(convertValue(evt.target.value))}
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
