import React from 'react';

import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import SettingPage from '../SettingPage';

const SettingPagePane = ({sectionName, ...props}) => {
  return (
    <Pane
      defaultWidth="fill"
      id={`settings-${sectionName}`}
      paneTitle={<FormattedMessage id={`ui-rs.settingsSection.${sectionName}`} />}
    >
      <SettingPage sectionName={sectionName} {...props}/>
    </Pane>
  );
}

export default SettingPagePane;