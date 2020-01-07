import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';

const ActionButton = ({ label, action, payload, success, error, performAction }) => (
  <Button
    buttonStyle="dropdownItem"
    onClick={() => performAction(action, payload, success, error)}
  >
    <FormattedMessage id={label} />
  </Button>
);

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  payload: PropTypes.object,
  success: PropTypes.string,
  error: PropTypes.string,
  performAction: PropTypes.func.isRequired,
};

export default ActionButton;
