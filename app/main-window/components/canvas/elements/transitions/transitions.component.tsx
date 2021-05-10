import React from 'react';
import { useSelector } from 'react-redux';
import { Transition } from './transition.component';
import { selectTransitions } from '../../../../redux/project/elements/transitions/transitions.selectors';

export const Transitions = () => {
  const transitions = useSelector(selectTransitions);
  return (
    <>
      {Object.entries(transitions).map(([id, transition]) => (
        <Transition key={id} transition={transition} />
      ))}
    </>
  );
};
