import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import StripesableUserCard from './StripesableUserCard';

class SmartUserCard extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.stripeyUserCard = withStripes(StripesableUserCard);
  }

  render() {
    return <this.stripeyUserCard {...this.props} />;
  }
}

export default SmartUserCard;
