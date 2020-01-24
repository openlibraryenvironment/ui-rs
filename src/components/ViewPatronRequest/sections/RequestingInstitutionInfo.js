import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import stringify from 'json-stable-stringify';
import { withStripes } from '@folio/stripes/core';
import get from 'lodash/get';
import {
  Accordion,
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './RequestingInstitutionInfo.css';

class RequestingInstitutionInfo extends React.Component {
  static propTypes = {
    record: PropTypes.shape({
      resolvedRequester: PropTypes.shape({
        owner: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      }),
    }),
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        showDevInfo: PropTypes.bool,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { record, stripes } = this.props;
    let institution = get(record, 'resolvedRequester.owner');

    let cardStyle;
    if (institution) {
      cardStyle = 'positive';
    } else {
      cardStyle = 'negative';
      institution = {};
    }

    return (
      <Card
        id="requestingInstitutionInfo-card"
        headerStart="Institution"
        headerEnd={<Link to={`/directory/entries/view/${institution.id}`}>View in directory</Link>}
        roundedBorder
        cardStyle={cardStyle}
        cardClass={css.institutionCard}
        headerClass={css.institutionCardHeader}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.institutionId" />}
              value={institution.id}
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
        {!stripes.config.showDevInfo ? '' :
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

export default withStripes(RequestingInstitutionInfo);
