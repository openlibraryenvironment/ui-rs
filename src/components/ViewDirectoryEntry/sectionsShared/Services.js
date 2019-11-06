import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Card, KeyValue, Row, Col, Headline } from '@folio/stripes/components';


function renderService(service, index, count) {
  // XXX I don't know what service.accountDetails is
  const ss = service.service;
  const header = ss.name ||
    <FormattedMessage id="ui-directory.information.serviceNofM" values={{ index, count }} />;

  return (
    <React.Fragment key={index}>
      <Card
        headerStart={<Headline margin={"none"}>{header}</Headline>}
        roundedBorder
        hasMargin
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.serviceFunction" />}
              value={ss.businessFunction.value}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.serviceType" />}
              value={ss.type.value}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.serviceAddress" />}
              value={<tt>{ss.address}</tt>}
            />
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
}


class Services extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const services = this.props.record.services || [];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.services" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        {services.map((service, i) => renderService(service, i + 1, services.length))}
      </Accordion>
    );
  }
}

export default Services;
