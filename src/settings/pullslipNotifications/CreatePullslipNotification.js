import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { user2rawData } from './util';
import PullslipNotificationForm from './PullslipNotificationForm';

const CreatePullslipNotification = (props) => {
  const { lmsLocations } = props.resources;
  if (!lmsLocations || !lmsLocations.hasLoaded) return null;

  const record = {
    status: true,
    name: '',
    times: [],
    days: '',
    locations: [],
    emailAddresses: [],
  };

  const onSubmit = (values) => {
    return props.mutator.timers.POST(user2rawData(values))
      .then((newRecord) => {
        props.history.push(`/settings/rs/pullslip-notifications/${newRecord.id}`);
      });
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

CreatePullslipNotification.propTypes = {
  resources: PropTypes.shape({
    lmsLocations: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    timers: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

CreatePullslipNotification.manifest = {
  timers: {
    type: 'okapi',
    path: 'rs/timers',
  },
  lmsLocations: {
    type: 'okapi',
    path: 'rs/hostLMSLocations',
    params: {
      perPage: '100',
    }
  },
};

export default stripesConnect(CreatePullslipNotification);
