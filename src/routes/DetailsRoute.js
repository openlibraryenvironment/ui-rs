import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import ViewPatronRequest from '../components/ViewPatronRequest';

const DetailsRoute = ({ request }) => {
  return (
    <Layout className="centered" style={{ maxWidth: '80em' }}>
      <ViewPatronRequest record={request} />
    </Layout>
  );
};

DetailsRoute.propTypes = {
  request: PropTypes.object.isRequired,
};

export default stripesConnect(DetailsRoute);
