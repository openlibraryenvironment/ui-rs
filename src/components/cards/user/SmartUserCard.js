import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import UserCard from './UserCard';

class SmartUserCard extends React.Component {
  static manifest = {
    user: {
      type: 'okapi',
      path: 'users/!{userId}',
      throwErrors: false,
    },
  };

  static propTypes = {
    userId: PropTypes.string,
    resources: PropTypes.shape({
      user: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.object
        ),
      }),
    }),
  };

  render() {
    return <UserCard user={get(this.props, 'resources.user.records.0')} {...this.props} />;
  }
}

export default stripesConnect(SmartUserCard);
