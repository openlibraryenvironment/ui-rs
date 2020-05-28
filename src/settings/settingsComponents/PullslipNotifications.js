import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, MultiColumnList } from '@folio/stripes/components';
import find from 'lodash/find';
import raw2userData from './raw2userData';
import SinglePullslipNotification from './SinglePullslipNotification';


class PullslipNotifications extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      timers: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      timers: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
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

  onRowClick = (_event, record) => {
    this.props.history.push(`pullslip-notifications/${record.id}`);
  }

  renderList(records) {
    return (
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
          locations: r => (r.locations || []).map(l => l.substr(0, 8)).join(', '),
          emailAddresses: r => r.emailAddresses.join(', '),
        }}
        onRowClick={this.onRowClick}
      />
    );
  }

  renderRecord(records, id) {
    const record = find(records, r => r.id === id);
    return <SinglePullslipNotification record={record} timersMutator={this.props.mutator.timers} />;
  }

  render() {
    const { timers } = this.props.resources;
    if (!timers || !timers.hasLoaded) return null;
    const records = timers.records[0].results.map(raw2userData);
    const { id } = this.props.match.params;

    return (
      <Pane defaultWidth="fill">
        {(!id || id === ':id') ? this.renderList(records) : this.renderRecord(records, id)}
      </Pane>
    );
  }
}

export default withRouter(stripesConnect(PullslipNotifications));
