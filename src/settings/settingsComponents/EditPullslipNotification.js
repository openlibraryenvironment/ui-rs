import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
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
      timer: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      timer: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = {
    timer: {
      type: 'okapi',
      path: 'rs/timers/:{id}',
    },
  };

  renderRecord(record) {
    return (
      <>
        edit6
        <SinglePullslipNotification record={record} timersMutator={this.props.mutator.timer} />
      </>
    );
  }

  render() {
    const { timer } = this.props.resources;
    if (!timer || !timer.hasLoaded) return null;
    const record = raw2userData(timer.records[0]);

    return (
      <Pane defaultWidth="fill">
        {this.renderRecord(record)}
      </Pane>
    );
  }
}

export default withRouter(stripesConnect(PullslipNotifications));
