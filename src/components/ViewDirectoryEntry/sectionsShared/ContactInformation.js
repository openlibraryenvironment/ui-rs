import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

import { Address } from '../components';

function renderAddress(address, index, count) {
  return (
    <Address key={`Address[${index}], ${address.addressLabel}`} {...{ address, index, count }} />
  );
}

class ContactInformation extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;
    const addresses = record.addresses || [];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.contactInformation" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainPhoneNumber" />}
              value={record.phoneNumber ? record.phoneNumber : <NoValue />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainEmailAddress" />}
              value={record.emailAddress ? record.emailAddress : <NoValue />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainContactName" />}
              value={record.contactName ? record.contactName : <NoValue />}
            />
          </Col>
        </Row>
        {addresses.sort((a, b) => {
          const addressA = a.addressLabel.toUpperCase();
          const addressB = b.addressLabel.toUpperCase();
          return (addressA < addressB) ? -1 : (addressA > addressB) ? 1 : 0;
        }).map((address, i) => renderAddress(address, i + 1, addresses.length))}
      </Accordion>
    );
  }
}

export default ContactInformation;
