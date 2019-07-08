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
    patronGroupRecord {
      group
      desc
    }
  }
}`;

class GraphQLUserCard extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    data: PropTypes.shape({
      users_SINGLE: PropTypes.object,
    }),
  };

  render() {
    return <UserCard user={get(this.props, 'data.users_SINGLE')} {...this.props} />;
  }
}

export default graphql(GET_USER, {
  options: props => ({
    variables: {
      id: props.userId,
    }
  })
})(GraphQLUserCard);
