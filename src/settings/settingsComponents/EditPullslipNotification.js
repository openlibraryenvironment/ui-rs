import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import raw2userData from './raw2userData';


class EditPullslipNotification extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
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
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = {
    timer: {
      type: 'okapi',
      path: 'rs/timers/:{id}',
    },
  };

  render() {
    const { timer } = this.props.resources;
    if (!timer || !timer.hasLoaded) return null;
    const record = raw2userData(timer.records[0]);

    return (
      <Pane defaultWidth="fill">
        <pre>
          {JSON.stringify(record, null, 2)}
        </pre>
      </Pane>
    );
  }
}

export default stripesConnect(EditPullslipNotification);
