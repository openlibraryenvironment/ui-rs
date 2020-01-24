import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stringify from 'json-stable-stringify';
import { withStripes } from '@folio/stripes/core';
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
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        showDevInfo: PropTypes.bool,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const props = Object.assign({}, this.props);
    // React complains if any of these props are passed in <Card>
    delete props.refreshRemote;
    delete props.dataKey;
    const institutionSymbol = props.institutionSymbol;
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
              label={<FormattedMessage id="ui-rs.information.institutionId" />}
              value={institution.id || institutionSymbol}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.institutionName" />}
              value={institution.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.institutionStatus" />}
              value={get(institution.status, ['label'])}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.slug" />}
              value={institution.slug}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.symbols" />}
              value={institution.symbolSummary}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.tags" />}
              value={institution.tagSummary}
            />
          </Col>
        </Row>
        {!props.stripes.config.showDevInfo ? '' :
        <Row>
          <Col xs={12}>
            <Accordion
              id="requestingInstitutionInfo-card-dev"
              label={<FormattedMessage id="ui-rs.information.heading.developer" />}
              closedByDefault
            >
              <pre>
                {stringify(institution, { space: 2 })}
              </pre>
            </Accordion>
          </Col>
        </Row>
        }
      </Card>
    );
  }
}

export default withStripes(InstitutionCard);
