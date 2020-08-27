import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion, Col, Headline, KeyValue, Layout, NoValue, Row } from '@folio/stripes/components';

const RequestInfo = ({ id, request }) => {
  const intl = useIntl();
  const requester = request?.resolvedRequester?.owner;
  const supplier = request?.resolvedSupplier?.owner;

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

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-rs.flow.sections.requestInfo" />}
    >
      <Layout className="padding-top-gutter">
        <Headline margin="none" size="large"><FormattedMessage id={`stripes-reshare.states.${request.state?.code}`} /></Headline>
        <FormattedMessage id="ui-rs.flow.info.updated" values={{ date: intl.formatDate(request.lastUpdated) }} />
      </Layout>
      <Layout className="padding-top-gutter">
        <Row>
          {colKeyVal('itemBarcode', request.selectedItemBarcode || <NoValue />)}
          {colKeyVal('dueDate', request.dueDateFromLMS || <NoValue />)}
          {colKeyVal('requester', requester ?
            <Link to={`/directory/entries/view/${requester.id}`}>
              {requester.name}
            </Link> :
            <NoValue />)}
          {colKeyVal('supplier', supplier ?
            <Link to={`/directory/entries/view/${supplier.id}`}>
              {supplier.name}
            </Link> :
            <NoValue />)}
        </Row>
      </Layout>
    </Accordion>
  );
};

RequestInfo.propTypes = {
  id: PropTypes.string.isRequired,
  request: PropTypes.object.isRequired,
};

export default RequestInfo;
