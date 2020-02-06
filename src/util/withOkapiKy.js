import React from 'react';
import PropTypes from 'prop-types';
import ky from 'ky';
import { withStripes } from '@folio/stripes/core';

function createOkapiKy(stripes) {
  const { tenant, token, url } = stripes.okapi;

  return ky.create({
    prefixUrl: url,
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set('X-Okapi-Tenant', tenant);
          request.headers.set('X-Okapi-Token', token);
        }
      ]
    }
  });
}

const withOkapiKy = (WrappedComponent) => {
  class HOC extends React.Component {
    static propTypes = {
      stripes: PropTypes.shape({
        okapi: PropTypes.shape({
          tenant: PropTypes.string.isRequired,
          token: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    };

    constructor(props) {
      super();
      this.okapiKy = createOkapiKy(props.stripes);
    }

    render() {
      return <WrappedComponent {...this.props} okapiKy={this.okapiKy} />;
    }
  }

  return withStripes(HOC);
};

export default withOkapiKy;
