import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion, Col, Headline, KeyValue, Layout, NoValue, Row } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

const RequestingUser = ({ request }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const patronURL = stripes?.config?.reshare?.patronURL?.replace('{patronid}', request.patronIdentifier);

  const colKeyVal = (labelId, value) => {
    return (
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id={`ui-rs.flow.info.${labelId}`} />}
          value={value}
        />
      </Col>
    );
  };

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
