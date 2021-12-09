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
  return (
    <div>
      <Button
        onClick={() => setModal(modal)}
        {...rest}
      />
    </div>
  );
};
ShowModalButton.propTypes = {
  modal: PropTypes.string,
};
