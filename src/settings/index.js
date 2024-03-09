import React from 'react';
import { useIntl } from 'react-intl';
import { Route } from 'react-router-dom';

import { useSettings } from '@k-int/stripes-kint-components';

import { CustomISO18626 } from './settingsComponents';
import HostLMSLocations from './HostLMSLocations';
import ShelvingLocationSites from './HostLMSLocations/ShelvingLocationSites';
import HostLMSPatronProfiles from './HostLMSPatronProfiles';
import HostLMSItemLoanPolicies from './HostLMSItemLoanPolicies';
import HostLMSShelvingLocations from './HostLMSShelvingLocations';
import Notices from './notices';
import NoticePolicies from './noticePolicies';
import OtherSettings from './OtherSettings';
import PullslipConfiguration from './pullslipConfiguration';
import PullslipTemplates from './pullslipTemplates';
import {
  PullslipNotifications, ViewPullslipNotification, EditPullslipNotification, CreatePullslipNotification
} from './pullslipNotifications';
import { REFDATA_ENDPOINT, SETTINGS_ENDPOINT, TEMPLATES_ENDPOINT } from '../constants/endpoints';

const ResourceSharingSettings = (props) => {
  const { match } = props;
  const intl = useIntl();

  const persistentPages = [
    {
      route: 'CustomISO18626Settings',
      id: 'iso18626',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.iso18626' }),
      component: CustomISO18626
    },
    {
      route: 'notices',
      id: 'notices',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.notices' }),
      component: Notices,
      perm: 'ui-rs.settings.notices',
    },
    {
      route: 'other',
      id: 'other',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.other' }),
      component: OtherSettings
    },
    {
      route: 'pullslipConfiguration',
      id: 'pullslipConfiguration',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.pullslipConfiguration' }),
      component: PullslipConfiguration,
      perm: 'ui-rs.settings.pullslip-notifications',
    },
    {
      route: 'pullslipTemplates',
      id: 'pullslipTemplates',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.pullslipTemplates' }),
      component: PullslipTemplates,
      perm: 'ui-rs.settings.pullslip-notifications',
    },
    {
      route: 'notice-policies',
      id: 'noticePolicies',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.noticePolicies' }),
      component: NoticePolicies,
      perm: 'ui-rs.settings.notices',
    },
    {
      route: 'pullslip-notifications',
      id: 'pullslipNotifications',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.pullslipNotifications' }),
      component: PullslipNotifications,
      perm: 'ui-rs.settings.pullslip-notifications',
    },
    {
      route: 'lmslocations',
      id: 'hostLMSLocations',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.hostLMSLocations' }),
      component: HostLMSLocations,
      perm: 'ui-rs.settings.hostlmslocations',
    },
    {
      route: 'lmspolicies',
      id: 'hostLMSItemLoanPolicies',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.hostLMSItemLoanPolicies' }),
      component: HostLMSItemLoanPolicies,
      perm: 'ui-rs.settings.hostlmslocations',
    },
    {
      route: 'lmsprofiles',
      id: 'hostLMSPatronProfiles',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.hostLMSPatronProfiles' }),
      component: HostLMSPatronProfiles,
      perm: 'ui-rs.settings.hostlmslocations',
    },
    {
      route: 'lmsshelving',
      id: 'hostLMSShelvingLocations',
      label: intl.formatMessage({ id: 'ui-rs.settings.settingsSection.hostLMSShelvingLocations' }),
      component: HostLMSShelvingLocations,
      perm: 'ui-rs.settings.hostlmslocations',
    },
  ];

  const { isLoading, SettingsComponent } = useSettings({
    dynamicPageExclusions: ['other', 'pullslipConfiguration', 'pullslipTemplateConfig'],
    intlKey: 'ui-rs',
    persistentPages,
    refdataEndpoint: REFDATA_ENDPOINT,
    settingEndpoint: SETTINGS_ENDPOINT,
    templateEndpoint: TEMPLATES_ENDPOINT
  });

  if (isLoading) {
    return null;
  }

  const additionalRoutes = [
    <Route
      key="pullslip-notifications/new"
      path={`${match.path}/pullslip-notifications/new`}
      component={CreatePullslipNotification}
    />,
    <Route
      key="pullslip-notifications/:id/edit"
      path={`${match.path}/pullslip-notifications/:id/edit`}
      component={EditPullslipNotification}
    />,
    <Route
      key="pullslip-notifications/:id"
      path={`${match.path}/pullslip-notifications/:id`}
      component={ViewPullslipNotification}
    />,
    <Route
      key="lmslocations/:id/shelvingsites"
      path={`${match.path}/lmslocations/:id/shelvingsites`}
      component={ShelvingLocationSites}
    />
  ];

  return (
    <SettingsComponent
      {...props}
      additionalRoutes={additionalRoutes}
    />
  );
};

export default ResourceSharingSettings;
