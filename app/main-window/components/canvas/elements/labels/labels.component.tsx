import React from 'react';
import { useSelector } from 'react-redux';
import { Label } from './label.component';
import { selectLabels } from '../../../../redux/project/elements/labels/labels.selectors';

export const Labels = () => {
  const labels = useSelector(selectLabels);
  return (
    <>
      {Object.entries(labels).map(([id, label]) => (
        <Label key={id} label={label} />
      ))}
    </>
  );
};
