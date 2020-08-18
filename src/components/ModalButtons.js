import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import { useModal } from './MessageModalState';
import { ActionContext } from './Flow/ActionContext';

export const CancelModalButton = props => {
  const [, setModal] = useModal();
  return <Button
    onClick={() => setModal(null)}
    {...props}
  />;
};

export const ShowModalButton = ({ modal, ...rest }) => {
  const [actions] = useContext(ActionContext);
  const [, setModal] = useModal();
  return (
    <div>
      <Button
        onClick={() => setModal(modal)}
        disabled={actions.pending}
        {...rest}
      />
    </div>
  );
};
ShowModalButton.propTypes = {
  modal: PropTypes.string,
};
