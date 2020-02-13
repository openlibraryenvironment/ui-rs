import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ScanConfirmAction from '../ScanConfirmAction';

export const ShippedReturn = props => <ScanConfirmAction
  action="shippedReturn"
  prompt="ui-rs.actions.markShippedReturn.prompt"
  success="ui-rs.actions.markShippedReturn.success"
  error="ui-rs.actions.markShippedReturn.error"
  {...props}
/>;

const Generic = props => {
  const { action, intl } = props;
  const promptKey = `ui-rs.actions.${action}.prompt`;
  const successKey = `ui-rs.actions.${action}.success`;
  const errorKey = `ui-rs.actions.${action}.error`;
  if (promptKey in intl.messages && successKey in intl.messages && errorKey in intl.messages) {
    return <ScanConfirmAction
      action={action}
      prompt={promptKey}
      success={successKey}
      error={errorKey}
      {...props}
    />;
  }
  return <ScanConfirmAction
    action={action}
    label={`ui-rs.actions.${action}`}
    {...props}
  />;
};

Generic.propTypes = {
  action: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Generic);
