import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import ViewPatronRequest from '../components/ViewPatronRequest';

const DetailsRoute = ({ resources: { selectedRecord: resource }, match }) => {
  if (!resource || !resource.hasLoaded) return null;
  const record = resource.records[0];
  if (record.id !== match.params.id) return null;
  return (
    <Layout className="centered" style={{ maxWidth: '80em' }}>
      <ViewPatronRequest record={record} />
    </Layout>
  );
};

DetailsRoute.manifest = {
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
  },
};

DetailsRoute.propTypes = {
  resources: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default stripesConnect(DetailsRoute);
