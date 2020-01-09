import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';

const ActionButton = ({ label, icon, action, payload, success, error, performAction }) => (
  <Button
    buttonStyle="dropdownItem"
    onClick={() => performAction(action, payload, success, error)}
  >
    <Icon icon={icon || 'default'}><FormattedMessage id={label} /></Icon>
  </Button>
);

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  action: PropTypes.string.isRequired,
  payload: PropTypes.object,
  success: PropTypes.string,
  error: PropTypes.string,
  performAction: PropTypes.func.isRequired,
};

export default ActionButton;
