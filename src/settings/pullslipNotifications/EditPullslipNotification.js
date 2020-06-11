import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { raw2userData, user2rawData } from './util';
import PullslipNotificationForm from './PullslipNotificationForm';

const EditPullslipNotification = (props) => {
  const { editTimer, lmsLocations } = props.resources;
  if (!editTimer || !editTimer.hasLoaded || !lmsLocations || !lmsLocations.hasLoaded) return null;

  const record = raw2userData(editTimer.records[0]);
  const onSubmit = (values) => {
    return props.mutator.editTimer.PUT(user2rawData(values))
      .then(() => props.history.push(`/settings/rs/pullslip-notifications/${values.id}`));
  };

  return (
    <PullslipNotificationForm
      record={record}
      lmsLocations={lmsLocations.records}
      onSubmit={onSubmit}
      {...props}
    />
  );
};

EditPullslipNotification.propTypes = {
  resources: PropTypes.shape({
    editTimer: PropTypes.shape({
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
  mutator: PropTypes.shape({
    editTimer: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

EditPullslipNotification.manifest = {
  editTimer: {
    type: 'okapi',
    path: 'rs/timers/:{id}',
  },
  lmsLocations: {
    type: 'okapi',
    path: 'rs/hostLMSLocations',
    params: {
      perPage: '100',
    }
  },
};

export default stripesConnect(EditPullslipNotification);
