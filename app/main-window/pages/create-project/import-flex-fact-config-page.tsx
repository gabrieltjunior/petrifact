import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Container,
  CssBaseline,
  Input,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { createProjectUseCase } from '../../sagas/editor/editor.actions';

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
    textAlign: 'justify',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const ImportFlexFactConfigPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onChange = (evt: any) => {
    dispatch(
      createProjectUseCase({ configFilePath: evt.target.files[0].path })
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <DashboardIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create a PetriFact Project
        </Typography>
        <Typography component="p" className={classes.form}>
          First, let&apos;s synch with your FlexFact project...
        </Typography>
        <Typography component="p" className={classes.form}>
          This tool enables you to communicate with your FlexFact project via
          the Modbus protocol. In order to achieve that, we need you to import
          the Modbus/TCP configuration from your existing FlexFact project into
          the tool.
        </Typography>
        <Typography component="p" className={classes.form}>
          Select a configuration file:
        </Typography>
        <Input type="file" onChange={onChange} className={classes.submit} />
      </div>
    </Container>
  );
};
