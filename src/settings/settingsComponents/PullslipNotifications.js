import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Paneset, Pane, MultiColumnList } from '@folio/stripes/components';
import find from 'lodash/find';
import { rrulestr } from 'rrule';
import PullslipNotification from './PullslipNotification';
import hardwiredRawSampleData from './raw-sample';


const hardwiredSampleData = hardwiredRawSampleData.map(raw => {
  const daymap = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const rrule = rrulestr(raw.rrule);
  const payload = JSON.parse(raw.taskConfig);
  const { locations, emailAddresses } = payload;

  return {
    id: raw.id,
    name: raw.description,
    status: raw.enabled,
    times: rrule.options.byhour.map(t => `${`0${t}`.substr(-2)}:00:00`),
    days: rrule.options.byweekday.map(w => daymap[w]),
    locations,
    emailAddresses,
  };
});


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
    this.props.history.push(`./${record.id}`);
  }

  renderList() {
    return (
      <MultiColumnList
        autosize
        contentData={hardwiredSampleData}
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

  renderRecord(id) {
    const record = find(hardwiredSampleData, r => r.id === id);
    return <PullslipNotification record={record} />;
  }

  render() {
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
