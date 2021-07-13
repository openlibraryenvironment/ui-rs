import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';
import { Accordion, Col, Headline, KeyValue, Layout, NoValue, Row } from '@folio/stripes/components';


function calculateDueDate(intl, request) {
  const dueDateText = request.dueDateFromLMS || request.dueDateRS;
  if (!dueDateText) return <NoValue />;

  // By inspection (the documentation is useless) intl.formatDate does
  // not throw an exception or return undefined when fed a bad date,
  // but vomits all over the JavaScript console and returns the
  // human-readable string "Invalid Date". That's no use, so we have
  // to check by hand whether the date string is OK. _sigh_

  if (dueDateText.match(/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2})?$/)) {
    return <FormattedDate value={dueDateText} />;
  }
  return <FormattedMessage id="ui-rs.invalid-date" values={{ date: dueDateText }} />;
}


const RequestInfo = ({ request }) => {
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

  const location = useLocation();
  const dueDate = calculateDueDate(intl, request);

  return (
    <Accordion
      id="requestInfo"
      label={<FormattedMessage id="ui-rs.flow.sections.requestInfo" />}
    >
      <Layout className="padding-top-gutter">
        <Headline margin="none" size="large"><FormattedMessage id={`stripes-reshare.states.${request.state?.code}`} /></Headline>
        {`${intl.formatMessage({ id: 'ui-rs.flow.info.updated' }, { date: intl.formatDate(request.lastUpdated) })} `}
        <Link to={{
          pathname: location?.pathname?.replace('flow', 'details'),
          search: location?.search,
          state: {
            scrollToAuditTrail: true
          }
        }}
        >
          <FormattedMessage id="ui-rs.flow.info.viewAuditLog" />
        </Link>
      </Layout>
      <Layout className="padding-top-gutter">
        <Row>
          {colKeyVal('itemBarcode', request.selectedItemBarcode || <NoValue />)}
          {colKeyVal('dueDate', dueDate)}
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
  request: PropTypes.object.isRequired,
};

export default RequestInfo;
