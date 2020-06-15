import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Card, Col, Headline, KeyValue, NoValue, Row } from '@folio/stripes/components';

function renderService(service, slug) {
  const header = service.name ||
    <FormattedMessage id="ui-directory.information.serviceForSlug" values={{ slug }} />;

  return (
    <Card
      headerStart={<Headline margin="none">{header}</Headline>}
      cardStyle="positive"
      roundedBorder
      marginBottom0
    >
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-directory.information.serviceFunction" />}
            value={service.businessFunction.value}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-directory.information.serviceType" />}
            value={service.type.value}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-directory.information.serviceAddress" />}
            value={<tt>{service.address}</tt>}
          />
        </Col>
      </Row>
    </Card>
  );
}

function renderServiceAccount(serviceAcct, index, count) {
  // XXX I don't know what service.accountDetails is
  const ss = serviceAcct.service;
  const header = serviceAcct.slug ||
    <FormattedMessage id="ui-directory.information.serviceAcctNofM" values={{ index, count }} />;

  return (
    <React.Fragment key={index}>
      <Card
        headerStart={<Headline margin="none">{header}</Headline>}
        roundedBorder
        marginBottom0
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.services.service" />}
              value={ss ? renderService(ss, serviceAcct.slug) : <NoValue />}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.services.accountDetails" />}
              value={serviceAcct.accountDetails ? serviceAcct.accountDetails : <NoValue />}
            />
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
}


class ServiceAccounts extends React.Component {
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
        {services.map((service, i) => renderServiceAccount(service, i + 1, services.length))}
      </Accordion>
    );
  }
}

export default ServiceAccounts;
