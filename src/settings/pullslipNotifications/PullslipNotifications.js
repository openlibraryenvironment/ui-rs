import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, MultiColumnList } from '@folio/stripes/components';
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
    }).isRequired,
  };

  static manifest = {
    timers: {
      type: 'okapi',
      path: 'rs/timers',
      params: {
        perPage: '100',
        stats: 'true',
      },
    },
  };

  render() {
    const { timers } = this.props.resources;
    if (!timers || !timers.hasLoaded) return null;
    const records = timers.records[0].results.map(raw2userData);

    return (
      <Pane defaultWidth="fill">
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
            times: r => r.times.join(', '),
            locations: r => (r.locations || []).map(l => l.substr(0, 8)).join(', '),
            emailAddresses: r => r.emailAddresses.join(', '),
          }}
          onRowClick={(_e, record) => this.props.history.push(`pullslip-notifications/${record.id}`)}
        />
      </Pane>
    );
  }
}

export default withRouter(stripesConnect(PullslipNotifications));
