import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Layout, Row } from '@folio/stripes/components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

const ILSCirculation = ({ request }) => {
  const validShortcodes = ['SLNPRequester', 'SLNPResponder', 'SLNPNonReturnableResponder', 'SLNPNonReturnableRequester'];
  if (!validShortcodes.includes(request.stateModel?.shortcode)) {
    return null;
  }

  const { customIdentifiers } = request;
  let loanUUID = null;
  let patronUUID = null;
  let requestUUID = null;
  let feeUUID = null;
  let itemUUID = null;

  if (customIdentifiers) {
    const parsedResponse = JSON.parse(customIdentifiers);
    if (parsedResponse) {
      loanUUID = parsedResponse.loanUuid;
      patronUUID = parsedResponse.patronUuid;
      requestUUID = parsedResponse.requestUuid;
      feeUUID = parsedResponse.feeUuid;
      itemUUID = parsedResponse.itemUuid;
    }
  }

  const { isSuccess, data } = useOkapiQuery('circulation/loans', {
    searchParams: `?query=(itemId=="${itemUUID || ''}" and userId=="${patronUUID || ''}")`
  });

  if (isSuccess && data && data.loans && data.loans.length > 0) {
    loanUUID = data.loans[0].id;
  }

  const showAccordion = (loanUUID && patronUUID) || requestUUID || (patronUUID && feeUUID);

  return showAccordion ? (
    <Accordion
      id="requestInfo"
      label={<FormattedMessage id="ui-rs.flow.sections.ilsCirculation" />}
    >
      <Layout className="padding-top-gutter">
        <Row>
          {requestUUID && (
          <Col xs={3}>
            <Link to={`/requests/view/${requestUUID}?sort=requestDate`}>
              <FormattedMessage id="ui-rs.flow.info.request" />
            </Link>
          </Col>
          )}
          {patronUUID && loanUUID && (
          <Col xs={3}>
            <Link to={`/users/${patronUUID}/loans/view/${loanUUID}`}>
              <FormattedMessage id="ui-rs.flow.info.createdLoan" />
            </Link>
          </Col>
          )}
          {patronUUID && feeUUID && (
          <Col xs={3}>
            <Link to={`/users/${patronUUID}/accounts/view/${feeUUID}`}>
              <FormattedMessage id="ui-rs.flow.info.createdFeeFine" />
            </Link>
          </Col>
          )}
        </Row>
      </Layout>
    </Accordion>
  ) : null;
};

export default ILSCirculation;
