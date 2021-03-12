import React from 'react';

import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const SettingPagePane = ({ sectionName, children }) => {
  return (
    <Pane
      defaultWidth="fill"
      id={`settings-${sectionName}`}
      paneTitle={<FormattedMessage id={`ui-rs.settingsSection.${sectionName}`} />}
    >
      {children}
    </Pane>
  );
};

export default SettingPagePane;
