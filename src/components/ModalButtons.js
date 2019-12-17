import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import { useModal } from './MessageModalState';

export const CancelModalButton = props => {
  const [, setModal] = useModal();
  return <Button
    onClick={() => setModal(null)}
    {...props}
  />;
};

export const ShowModalButton = ({ modal, ...rest }) => {
  const [, setModal] = useModal();
  return <Button
    onClick={() => setModal(modal)}
    {...rest}
  />;
};
ShowModalButton.propTypes = {
  modal: PropTypes.string,
};
