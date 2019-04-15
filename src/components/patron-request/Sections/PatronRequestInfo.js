import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


class PatronRequestInfo extends React.Component {

  static propTypes = {
    patronRequestInfo: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { patronRequestInfo } = this.props;

    return (
      <h1>Patron Request Info</h1>
    );
  }
}

export default PatronRequestInfo;
