import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@folio/stripes/components';
import ConnectableUserCard from './ConnectableUserCard';

class StripesableUserCard extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedUserCard = props.stripes.connect(ConnectableUserCard);
  }

  render() {
    // Remove this hack when https://github.com/folio-org/stripes-connect/pull/93 is fixed
    if (!this.props.userId) {
      return (
        <Card id="requestingUserInfo-card" headerStart="User" roundedBorder cardStyle="negative">
         (No user)
        </Card>
      );
    }

    return <this.connectedUserCard {...this.props} />;
  }
}

export default StripesableUserCard;
