import React from 'react';
import PropTypes from 'prop-types';
import GraphQLUserCard from '../../cards/user/GraphQLUserCard';

import css from './RequestingUserInfo.css';

class RequestingUserInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;

    return (
      <GraphQLUserCard
        id={`${this.props.id}-card`}
        userId={record.patronReference}
        cardClass={css.userCard}
        headerClass={css.userCardHeader}
      />
    );
  }
}

export default RequestingUserInfo;
