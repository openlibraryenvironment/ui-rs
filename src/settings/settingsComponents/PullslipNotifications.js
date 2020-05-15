import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Paneset, Pane, MultiColumnList } from '@folio/stripes/components';
import hardwiredSampleData from './sample';


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
  };

  onRowClick = (_event, record) => {
    console.log('clicked row:', record);
    this.props.history.push(`./${record.id}`);
  }

  renderList() {
    return (
      <MultiColumnList
        autosize
        contentData={hardwiredSampleData}
        visibleColumns={['status', 'name', 'days', 'times', 'locations', 'emailAddresses']}
        columnMapping={{
          status: <FormattedMessage id="ui-rs.pullslipNotification.column.status" />,
          name: <FormattedMessage id="ui-rs.pullslipNotification.column.name" />,
          days: <FormattedMessage id="ui-rs.pullslipNotification.column.days" />,
          times: <FormattedMessage id="ui-rs.pullslipNotification.column.times" />,
          locations: <FormattedMessage id="ui-rs.pullslipNotification.column.locations" />,
          emailAddresses: <FormattedMessage id="ui-rs.pullslipNotification.column.emailAddresses" />,
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

  renderRecord(id) {
    return `Record ${id}`;
  }

  render() {
    console.log('match =', this.props.match);
    const { id } = this.props.match.params;
    return (
      <Paneset>
        <Pane defaultWidth="100%">
          {(!id || id === ':id') ? this.renderList() : this.renderRecord(id)}
        </Pane>
      </Paneset>
    );
  }
}

export default withRouter(PullslipNotifications);
