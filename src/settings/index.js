import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import { CustomISO18626, SettingPagePane, SettingPage } from './settingsComponents';
import HostLMSLocations from './HostLMSLocations';
import Notices from './notices';
import NoticePolicies from './noticePolicies';
import OtherSettings from './OtherSettings';
import PullslipTemplates from './pullslipTemplates';
import {
  PullslipNotifications, ViewPullslipNotification, EditPullslipNotification, CreatePullslipNotification
} from './pullslipNotifications';

import snakeToCamel from '../util/snakeToCamel';

function sortByLabelCaseInsensitive(a, b) {
  const al = a.label.toLowerCase();
  const bl = b.label.toLowerCase();
  return (al < bl) ? -1 : (al > bl) ? 1 : 0;
}

const persistentPages = [
  {
    route: 'CustomISO18626Settings',
    id: 'iso18626',
    component: CustomISO18626,
    perm: 'ui-rs.settings.system',
  },
  {
    route: 'notices',
    id: 'notices',
    component: Notices,
    perm: 'ui-rs.settings.notices',
  },
  {
    route: 'other',
    id: 'other',
    component: OtherSettings,
    perm: 'ui-rs.settings.system',
  },
  {
    route: 'pullslipTemplates',
    id: 'pullslipTemplates',
    component: PullslipTemplates,
    perm: 'ui-rs.settings.pullslip-notifications',
  },
  {
    route: 'notice-policies',
    id: 'noticePolicies',
    component: NoticePolicies,
    perm: 'ui-rs.settings.notices',
  },
  {
    route: 'pullslip-notifications',
    id: 'pullslipNotifications',
    component: PullslipNotifications,
    perm: 'ui-rs.settings.pullslip-notifications',
  },
  {
    route: 'lmslocations',
    id: 'hostLMSLocations',
    component: HostLMSLocations
  },
];

const dynamicPageExclusions = ['pullslipTemplateConfig'];

const ResourceSharingSettings = (props) => {
  const intl = useIntl();
  const { match } = props;

  const makePageList = () => {
    const rows = (props.resources.settings || {}).records || [];
    let sections = Array.from(new Set(rows.map(obj => obj.section)));

    // Remove excluded sections
    sections = sections.filter(s => {
      return !dynamicPageExclusions.includes(s);
    });

    if (sections.length === 0) return [];

    const persistent = persistentPages.map(page => ({
      route: page.route,
      label: intl.formatMessage({ id: `ui-rs.settingsSection.${page.id}` }),
      component: page.component,
      perm: page.perm,
    }));

    const dynamic = sections.map(section => {
      const sectionFormatted = snakeToCamel(section);
      return (
        {
          route: sectionFormatted,
          label: intl.formatMessage({ id: `ui-rs.settingsSection.${sectionFormatted}` }),
          component: (prps) => (
            <SettingPagePane sectionName={section}>
              <SettingPage sectionName={section} {...prps} />
            </SettingPagePane>
          ),
          perm: 'ui-rs.settings.system',
        }
      );
    });

    const settingPageList = persistent.concat(dynamic).sort(sortByLabelCaseInsensitive);
    return settingPageList;
  };

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

  const pageList = makePageList();
  // XXX DO NOT REMOVE THE NEXT LINE. For reasons we do not
  // understand, if once this code renders an empty set of pages, it
  // will not re-render until you navigate away and return. This
  // apparently unnecessary check prevents that.
  if (pageList.length === 0) return null;

  return (
    <Settings
      paneTitle={<FormattedMessage id="ui-rs.meta.title" />}
      {...props}
      pages={pageList}
      additionalRoutes={additionalRoutes}
    />
  );
};

ResourceSharingSettings.manifest = Object.freeze({
  settings: {
    type: 'okapi',
    path: 'rs/settings/appSettings',
    params: {
      max: '500',
    },
  }
});

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

export default stripesConnect(ResourceSharingSettings);
