import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import SettingPage from './SettingPage';
import { CustomISO18626 } from './settingsComponents';
import Notices from './notices';
import NoticePolicies from './noticePolicies';
import {
  PullslipNotifications, ViewPullslipNotification, EditPullslipNotification, CreatePullslipNotification
} from './pullslipNotifications';

import snakeToCamel from '../util/snakeToCamel';

function sortByLabelCaseInsensitive(a, b) {
  const al = a.label.toLowerCase();
  const bl = b.label.toLowerCase();
  return (al < bl) ? -1 : (al > bl) ? 1 : 0;
}

class ResourceSharingSettings extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        max: '500',
      },
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      settings: PropTypes.shape({
        records: PropTypes.array
      })
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  persistentPages = [
    {
      route: 'CustomISO18626Settings',
      id: 'iso18626',
      component: CustomISO18626
    },
    {
      route: 'notices',
      id: 'notices',
      component: Notices,
      perm: 'ui-rs.settings.notices',
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
  ];

  pageList() {
    const { intl } = this.props;
    const rows = (this.props.resources.settings || {}).records || [];
    const sections = Array.from(new Set(rows.map(obj => obj.section)));
    if (sections.length === 0) return [];

    const persistent = this.persistentPages.map(page => ({
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
          component: (props) => <SettingPage sectionName={section} {...props} />,
        }
      );
    });

    const settingPageList = persistent.concat(dynamic).sort(sortByLabelCaseInsensitive);
    return settingPageList;
  }

  render() {
    const pageList = this.pageList();
    const { match } = this.props;

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

    // XXX DO NOT REMOVE THE NEXT LINE. For reasons we do not
    // understand, if once this code renders an empty set of pages, it
    // will not re-render until you navigate away and return. This
    // apparently unnecessary check prevents that.
    if (pageList.length === 0) return null;

    return <Settings
      paneTitle={<FormattedMessage id="ui-rs.meta.title" />}
      {...this.props}
      pages={pageList}
      additionalRoutes={additionalRoutes}
    />;
  }
}

export default injectIntl(stripesConnect(ResourceSharingSettings));
