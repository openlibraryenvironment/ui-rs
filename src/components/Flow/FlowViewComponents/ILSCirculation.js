import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Layout, Row } from '@folio/stripes/components';

const ILSCirculation = ({ request }) => {
  const { customIdentifiers } = request;
  let loanUUID = null;
  let patronUUID = null;

  if (customIdentifiers) {
    const parsedResponse = JSON.parse(customIdentifiers);
    if (parsedResponse && parsedResponse.loanUuid && parsedResponse.patronUuid) {
      loanUUID = parsedResponse.loanUuid;
      patronUUID = parsedResponse.patronUuid;
    }
  }

  return (
    loanUUID && patronUUID ?
      <Accordion
        id="ilsCirculation"
        label={<FormattedMessage id="ui-rs.flow.sections.ilsCirculation" />}
      >
        <Layout className="padding-top-gutter">
          <Row>
            <Col xs={3}>
              <Link to={`/users/${patronUUID}/loans/open`}>
                <FormattedMessage id="ui-rs.flow.info.request" />
              </Link>
            </Col>
            <Col xs={3}>
              <Link to={`/users/${patronUUID}/loans/view/${loanUUID}`}>
                <FormattedMessage id="ui-rs.flow.info.createdLoan" />
              </Link>
            </Col>
          </Row>
        </Layout>
      </Accordion>
      : ''
  );
};

export default ILSCirculation;
