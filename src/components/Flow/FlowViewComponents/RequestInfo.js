import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion, Col, Headline, KeyValue, Layout, NoValue, Row } from '@folio/stripes/components';

function calculateDueDate(intl, request) {
  if (request.parsedDueDateRS) {
    return intl.formatDate(request.parsedDueDateRS, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
  const dueDateText = request.dueDateFromLMS || request.dueDateRS;
  if (!dueDateText) return <NoValue />;
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
  const itemBarcodeText = request.volumes?.length <= 1 ? request.volumes[0]?.itemId : <FormattedMessage id="ui-rs.flow.info.itemBarcode.multiVolRequest" />;

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
          {colKeyVal('itemBarcode', itemBarcodeText || <NoValue />)}
          {colKeyVal('dueDate', calculateDueDate(intl, request))}
          {colKeyVal('volumesNeeded', request.volume) || <NoValue />}
        </Row>
        {request.patronNote &&
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.notes" />}
                value={request.patronNote}
              />
            </Col>
          </Row>
        }
      </Layout>
    </Accordion>
  );
};

export default RequestInfo;
