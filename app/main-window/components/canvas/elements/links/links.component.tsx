import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from './link.component';
import { selectLinks } from '../../../../redux/project/elements/links/links.selectors';

export const Links = () => {
  const links = useSelector(selectLinks);
  return (
    <>
      {Object.entries(links).map(([id, link]) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link key={id} link={link} />
      ))}
    </>
  );
};
