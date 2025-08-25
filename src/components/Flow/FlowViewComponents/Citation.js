import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, KeyValue, Row } from '@folio/stripes/components';

const Citation = ({ request }) => {
  if (request.serviceType?.value !== 'copy') return null;

  return (
    <Accordion
      id="citation"
      label={<FormattedMessage id="ui-rs.flow.sections.citation" />}
    >
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.titleOfComponent" />}
            value={request.titleOfComponent}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.volume" />}
            value={request.volume}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.date" />}
            value={request.publicationDate}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.authorOfComponent" />}
            value={request.authorOfComponent}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.issue" />}
            value={request.issue}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.pages" />}
            value={request.pagesRequested}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.information.copyrightType" />}
            value={<FormattedMessage id={`ui-rs.refdata.copyrightType.${request.copyrightType?.value}`} />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

export default Citation;
