import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Route } from 'react-router-dom';

import { useSettings } from '@k-int/stripes-kint-components';

import { CustomISO18626 } from './settingsComponents';
import HostLMSLocations from './HostLMSLocations';
import Notices from './notices';
import NoticePolicies from './noticePolicies';
import OtherSettings from './OtherSettings';
import PullslipTemplates from './pullslipTemplates';
import {
  PullslipNotifications, ViewPullslipNotification, EditPullslipNotification, CreatePullslipNotification
} from './pullslipNotifications';

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
      component: HostLMSLocations
    },
  ];

  const { isLoading, SettingsComponent } = useSettings({
    dynamicPageExclusions: ['pullslipTemplateConfig'],
    intlKey: 'ui-rs',
    persistentPages,
    refdataEndpoint: 'rs/refdata',
    settingEndpoint: 'rs/settings/appSettings',
    templateEndpoint: 'rs/template'
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
    />
  ];

  return (
    <SettingsComponent
      {...props}
      additionalRoutes={additionalRoutes}
    />
  );
};

ResourceSharingSettings.propTypes = {
  resources: PropTypes.shape({
    settings: PropTypes.shape({
      records: PropTypes.array
    })
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceSharingSettings;
