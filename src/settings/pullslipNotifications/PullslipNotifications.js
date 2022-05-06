import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, MultiColumnList, Button } from '@folio/stripes/components';

import { SettingPage } from '@k-int/stripes-kint-components';

import { raw2userData } from './util';


class PullslipNotifications extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      timers: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
      lmsLocations: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
    }).isRequired,
  };

  static manifest = {
    timers: {
      type: 'okapi',
      path: 'rs/timers',
      params: {
        perPage: '100',
        stats: 'true',
        sort: 'description;asc',
      },
    },
    lmsLocations: {
      type: 'okapi',
      path: 'rs/hostLMSLocations',
      params: {
        perPage: '100',
      }
    }
  };


  render() {
    const {
      timers,
      lmsLocations,
    } = this.props.resources;

    if (!timers || !timers.hasLoaded || !lmsLocations || !lmsLocations.hasLoaded) return null;

    const locationId2Name = {};
    lmsLocations.records.forEach(x => { locationId2Name[x.id] = x.name; });

    const records = timers.records[0].results
      .filter(ps => ps.taskCode === 'PrintPullSlips')
      .map(raw2userData);

    return (
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.pullslipNotifications" />}
        lastMenu={(
          <Button marginBottom0 buttonStyle="primary" to="pullslip-notifications/new">
            <FormattedMessage id="ui-rs.settings.pullslipNotifications.new" />
          </Button>
        )}
      >
        <SettingPage
          sectionName="pullslipTemplateConfig"
        />
        <MultiColumnList
          autosize
          contentData={records}
          visibleColumns={['status', 'name', 'days', 'times', 'locations', 'emailAddresses']}
          columnMapping={{
            status: <FormattedMessage id="ui-rs.pullslipNotification.status" />,
            name: <FormattedMessage id="ui-rs.pullslipNotification.name" />,
            days: <FormattedMessage id="ui-rs.pullslipNotification.days" />,
            times: <FormattedMessage id="ui-rs.pullslipNotification.times" />,
            locations: <FormattedMessage id="ui-rs.pullslipNotification.locations" />,
            emailAddresses: <FormattedMessage id="ui-rs.pullslipNotification.emailAddresses" />,
          }}
          columnWidths={{
            status: 60,
            name: 150,
            days: 150,
            times: 150,
            locations: 250,
            emailAddresses: 400,
          }}
          formatter={{
            days: r => r.days.join(', '),
            times: r => r.times.join(', '),
            locations: r => (r.locations || []).map(l => locationId2Name[l]).join(', '),
            emailAddresses: r => r.emailAddresses.join(', '),
          }}
          onRowClick={(_e, record) => this.props.history.push(`pullslip-notifications/${record.id}`)}
        />
      </Pane>
    );
  }
}

export default withRouter(stripesConnect(PullslipNotifications));
