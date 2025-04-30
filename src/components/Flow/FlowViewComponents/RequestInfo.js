import React, { useState } from 'react';
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
  const requester = (request?.resolvedRequester?.owner) ?? request?.requestingInstitutionSymbol;
  const supplier = (request?.resolvedSupplier?.owner) ?? request?.supplyingInstitutionSymbol;

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
  const itemBarcodeText = request.volumes?.length <= 1 ? (request.volumes[0]?.itemId || request.selectedItemBarcode) : <FormattedMessage id="ui-rs.flow.info.itemBarcode.multiVolRequest" />;
  const itemCallNumberText = request.volumes?.length <= 1 ? (request.volumes[0]?.callNumber) : <FormattedMessage id="ui-rs.flow.info.itemCallNumber.multiVolRequest" />;
  const [showStateCode, setShowStateCode] = useState(false);

  return (
    <Accordion
      id="requestInfo"
      label={<FormattedMessage id="ui-rs.flow.sections.requestInfo" />}
    >
      <Layout className="padding-top-gutter" onClick={e => (e.altKey || e.ctrlKey || e.shiftKey) && setShowStateCode(true)}>
        <Headline margin="none" size="large">
          <FormattedMessage id={`stripes-reshare.states.${request.state?.code}`} />
          {showStateCode && <span> ({request.state?.code})</span>}
        </Headline>
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
          {colKeyVal('requester', requester?.name ?
            <Link to={`/directory/entries/view/${requester.id}`}>
              {requester?.name ?? requester}
            </Link> :
            requester ??
            <NoValue />)}
          {colKeyVal('supplier', supplier?.name ?
            <Link to={`/directory/entries/view/${supplier.id}`}>
              {supplier.name}
            </Link> :
            supplier ??
            <NoValue />)}
          {colKeyVal('itemBarcode', itemBarcodeText || <NoValue />)}
          {colKeyVal('itemCallNumber', itemCallNumberText || <NoValue />)}
          {colKeyVal('dueDate', calculateDueDate(intl, request))}
          {colKeyVal('volumesNeeded', request.volume) || <NoValue />}
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.serviceType" />}
              value={request.serviceType?.label}
            />
          </Col>
        </Row>
        <Row>
          {request.patronNote &&
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.notes" />}
                value={request.patronNote}
              />
            </Col>
          }
          {request.localNote &&
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.localNote" />}
                value={request.localNote}
              />
            </Col>
          }
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.serviceLevel" />}
              value={request.serviceLevel?.label}
            />
          </Col>
          {request.maximumCostsMonetaryValue &&
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.maximumCost" />}
              value={request.maximumCostsMonetaryValue + ' ' + request.maximumCostsCurrencyCode?.label}
            />
          </Col>
          }
        </Row>
      </Layout>
    </Accordion>
  );
};

export default RequestInfo;
