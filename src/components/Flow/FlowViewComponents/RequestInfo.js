import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Accordion, Col, Headline, KeyValue, Layout, NoValue, Row } from '@folio/stripes/components';

import * as cards from '../cardsByRequest';
import renderNamedWithProps from '../../../util/renderNamedWithProps';

import css from './Flow.css';

const RequestInfo = ({ forCurrent, id, request }) => {
  const stripes = useStripes();
  const intl = useIntl();
  const requester = request?.resolvedRequester?.owner;
  const supplier = request?.resolvedSupplier?.owner;

  const inventoryLink = (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${stripes.config.sharedIndexUI}/inventory/view/${id}`}
    >
      <FormattedMessage id="ui-rs.flow.info.viewInSharedIndex" />
    </a>
  );

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
    <>
      <Headline margin="none" size="large" tag="h2" weight="regular">
        <strong>{`${request.hrid || request.id}: `}</strong>
        {request.title}
      </Headline>
      {inventoryLink}
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
    </>
  );
};

RequestInfo.propTypes = {
  id: PropTypes.string.isRequired,
  forCurrent: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
};

export default RequestInfo;
