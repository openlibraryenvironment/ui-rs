import React from 'react';
import { useIntl } from 'react-intl';
import ControlledRefdata from './settingsComponents/ControlledRefdata';

const OtherSettings = () => {
  const intl = useIntl();
  return (<ControlledRefdata
    category="cancellationReasons"
    label={intl.formatMessage({ id: 'ui-rs.settingName.cancellationReasons' })}
    formatter={{ label: r => intl.formatMessage({ id: `ui-rs.actions.requesterCancel.reasons.${r.value}`, defaultMessage: r.label }) }}
  />);
};

export default OtherSettings;
