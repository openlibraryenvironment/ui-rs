import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserCard from './UserCard';

const GET_USER = gql`
query ($id: String!) {
  users_SINGLE (userId: $id) {
    id
    username
    personal {
      firstName
      lastName
      email
    }
    patronGroup
    patronGroupName
    patronGroupDescription
  }
}`;

class GraphQLUserCard extends React.Component {
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
    return <UserCard user={get(this.props, 'data.users_SINGLE')} {...this.props} />;
  }
}

export default graphql(GET_USER, {
  options: props => {
    return ({
      variables: {
        id: props.userId,
      }
    });
  }
})(GraphQLUserCard);
