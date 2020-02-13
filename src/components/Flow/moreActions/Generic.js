import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ActionButton from '../ActionButton';

const actionIcons = {
  supplierPrintPullSlip: 'print',
};

const Generic = props => {
  const { name:action, intl } = props;
  const successKey = `ui-rs.actions.${action}.success`;
  const errorKey = `ui-rs.actions.${action}.error`;
  if (successKey in intl.messages && errorKey in intl.messages) {
    return <ActionButton
      action={action}
      label={`ui-rs.actions.${action}`}
      icon={actionIcons[action]}
      success={successKey}
      error={errorKey}
      {...props}
    />;
  }
  return <ActionButton
    action={action}
    label={`ui-rs.actions.${action}`}
    icon={actionIcons[action]}
    {...props}
  />;
};

Generic.propTypes = {
  name: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Generic);
