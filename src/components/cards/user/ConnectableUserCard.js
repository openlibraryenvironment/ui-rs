import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import UserCard from './UserCard';

class ConnectableUserCard extends React.Component {
  static manifest = {
    user: {
      type: 'okapi',
      path: 'users/!{userId}',
    },
  };

  static propTypes = {
    userId: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.shape({
      user: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.object
        ),
      }),
    }),
  };

  render() {
    return <UserCard user={get(this.props, 'resources.user.records.0')} />;
  }
}

export default ConnectableUserCard;
