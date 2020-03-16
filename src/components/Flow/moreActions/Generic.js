import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { actionIcons } from '../actionsByState';
import ActionButton from '../ActionButton';

const Generic = props => {
  const { name:action, intl } = props;
  const successKey = `stripes-reshare.actions.${action}.success`;
  const errorKey = `stripes-reshare.actions.${action}.error`;
  if (successKey in intl.messages && errorKey in intl.messages) {
    return <ActionButton
      action={action}
      label={`stripes-reshare.actions.${action}`}
      icon={actionIcons[action]}
      success={successKey}
      error={errorKey}
      {...props}
    />;
  }
  return <ActionButton
    action={action}
    label={`stripes-reshare.actions.${action}`}
    icon={actionIcons[action]}
    {...props}
  />;
};

Generic.propTypes = {
  name: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Generic);
