import React from 'react';
import { useSelector } from 'react-redux';
import { Place } from './place.component';
import { selectPlaces } from '../../../../redux/project/elements/places/places.selectors';

export const Places = () => {
  const places = useSelector(selectPlaces);
  return (
    <>
      {Object.entries(places).map(([id, place]) => (
        <Place key={id} place={place} />
      ))}
    </>
  );
};
