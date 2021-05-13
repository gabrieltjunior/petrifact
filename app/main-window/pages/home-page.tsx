import React from 'react';
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { routes } from '../constants/routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <DashboardIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to PetriFact
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            dispatch(push(routes.createProject.importFlexFactConfig));
          }}
        >
          Create Project
        </Button>
        {/* <Button
          type="button"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
        >
          Open Project
        </Button> */}
      </div>
    </Container>
  );
};
