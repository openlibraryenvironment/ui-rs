import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ScanConfirmAction from '../ScanConfirmAction';

const Generic = props => {
  const { name:action, intl } = props;
  const promptKey = `ui-rs.actions.${action}.prompt`;
  const successKey = `stripes-reshare.actions.${action}.success`;
  const errorKey = `stripes-reshare.actions.${action}.error`;
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
    label={`stripes-reshare.actions.${action}`}
    {...props}
  />;
};

Generic.propTypes = {
  name: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Generic);
