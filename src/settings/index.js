import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import SettingPage from './SettingPage';
import SettingsPages from './SettingsPages';

class ResourceSharingSettings extends React.Component { 
  settingsSections = [
    {
      label: 'General',
      pages: [
        {
          route: 'requester-validation',
          label: <FormattedMessage id="ui-rs.settings.requester-validation" />,
          component: SettingPage,
        },
      ],
    },
    {
      label: 'Request',
      pages: [],
    },
    {
      label: 'Supply',
      pages: [
        
      ],
    },
  ];

  render() {
    return (
      <React.Fragment>
        <SettingsPages />
      <Settings {...this.props} sections={this.settingsSections} paneTitle="Resource Sharing" />
      </React.Fragment>
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
