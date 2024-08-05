import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Layout, Row } from '@folio/stripes/components';

const ILSCirculation = ({ request }) => {
  const { customIdentifiers } = request;
  let loanUUID = null;
  let patronUUID = null;
  let requestUUID = null;
  let userUUID = null;
  let feeUUID = null;

  if (customIdentifiers) {
    const parsedResponse = JSON.parse(customIdentifiers);
    if (parsedResponse) {
      loanUUID = parsedResponse.loanUuid;
      patronUUID = parsedResponse.patronUuid;
      requestUUID = parsedResponse.requestUuid;
      userUUID = parsedResponse.userUuid;
      feeUUID = parsedResponse.feeUuid;
    }
  }

  return (
    ((loanUUID && patronUUID) || requestUUID || (userUUID && feeUUID)) ? (
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
            {userUUID && feeUUID && (
              <Col xs={3}>
                <Link to={`/users/${userUUID}/accounts/view/${feeUUID}`}>
                  <FormattedMessage id="ui-rs.flow.info.createdFeeFine" />
                </Link>
              </Col>
            )}
          </Row>
        </Layout>
      </Accordion>
    ) : null
  );
};

export default ILSCirculation;
