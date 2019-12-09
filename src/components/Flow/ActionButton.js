import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';

const ActionButton = ({ label, action, payload, successMessage, errorMessage, performAction }) => (
  <Button
    buttonStyle="dropdownItem"
    onClick={() => performAction(action, payload, successMessage, errorMessage)}
  >
    {label}
  </Button>
);

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  payload: PropTypes.object,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  performAction: PropTypes.func.isRequired,
};

export default ActionButton;
