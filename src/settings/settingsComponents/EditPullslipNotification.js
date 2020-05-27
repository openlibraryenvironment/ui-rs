import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

const EditPullslipNotification = (props) => (
  <Pane defaultWidth="fill">
    <h1>
      Edit record
      &nbsp;
      {props.match.params.id}
    </h1>
    <pre>
      {props.resources}
    </pre>
  </Pane>
);

EditPullslipNotification.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
  }).isRequired,
};

EditPullslipNotification.xmanifest = {
  timer: {
    type: 'okapi',
    path: 'rs/timers/!{id}',
  },
};

export default stripesConnect(EditPullslipNotification);
