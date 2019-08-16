import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class InstitutionCard extends React.Component {
  static propTypes = {
    institution: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  render() {
    const props = Object.assign({}, this.props);
    // React complains if any of these props are passed in <Card>
    delete props.refreshRemote;
    delete props.dataKey;
    delete props.institutionSymbol;

    let institution = props.institution;
    if (institution) {
      props.cardStyle = 'positive';
    } else {
      props.cardStyle = 'negative';
      delete props.headerClass;
      delete props.cardClass;
      institution = {};
    }

    return (
      <Card
        id="requestingInstitutionInfo-card"
        headerStart="Institution"
        roundedBorder
        {...props}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label="ID"
              value={institution.id}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label="Name"
              value={institution.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label="Status"
              value={get(institution.status, ['label'])}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label="Slug"
              value={institution.slug}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label="Symbols"
              value={institution.symbolSummary}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label="Tags"
              value={institution.tagSummary}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Accordion
              id="requestingInstitutionInfo-card-dev"
              label={<FormattedMessage id="ui-rs.information.devInfo" />}
              closedByDefault
            >
              <pre>
                {JSON.stringify(institution, null, 2)}
              </pre>
            </Accordion>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default InstitutionCard;
