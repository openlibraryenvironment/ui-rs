import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, KeyValue, Row } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

const RequestingUser = ({ request }) => {
  const stripes = useStripes();
  const patronURL = stripes?.config?.reshare?.patronURL?.replace('{patronid}', request.patronIdentifier);

  if (!request.isRequester || !patronURL) return null;

  return (
    <Accordion
      id="requestingUser"
      label={<FormattedMessage id="ui-rs.flow.sections.requestingUser" />}
    >
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.lastName" />}
            value={request.patronSurname}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.firstName" />}
            value={request.patronGivenName}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.userId" />}
            value={request.patronIdentifier}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Link to={patronURL}><FormattedMessage id="ui-rs.flow.info.patronLink" /></Link>
        </Col>
        <Col xs={4}>
          <Link to={`/request/requests?filters=terminal.false&qindex=patronIdentifier&query=${request.patronIdentifier}&sort=-dateCreated`}>
            <FormattedMessage id="ui-rs.flow.info.patronQuery" />
          </Link>
        </Col>
      </Row>
    </Accordion>
  );
};

export default RequestingUser;
