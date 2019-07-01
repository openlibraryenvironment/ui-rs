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
    return <this.connectedUserCard {...this.props} />;
  }
}

export default StripesableUserCard;
