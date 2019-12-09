// http://shared-index.reshare-dev.indexdata.com/inventory/view/7c4420ad-a946-4099-b616-aff3e9f581e4
// http://ec2-34-229-181-20.compute-1.amazonaws.com:9130/inventory/instances/7c4420ad-a946-4099-b616-aff3e9f581e4

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { withStripes } from '@folio/stripes/core';
import {
  Accordion,
  Card,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import css from './CatalogInfo.css';

class CatalogInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    closedByDefault: PropTypes.bool,
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        sharedIndexUI: PropTypes.string.isRequired,
      }),
    }),
  };

  render() {
    const { record, stripes } = this.props;
    const id = record.systemInstanceIdentifier;
    const json = record.bibRecord;
    if (!json) {
      stripes.logger.log('bib', 'no bibRecord');
      return null;
    }

    let bibRecord;
    try {
      bibRecord = JSON.parse(json);
    } catch (e) {
      stripes.logger.log('bib', `could not parse bibRecord '${json}':`, e);
      return null;
    }

    stripes.logger.log('bib', 'bibRecord =', bibRecord);
    const title = bibRecord.title;
    const author = get(bibRecord, 'contributors[0].name');
    const date = get(bibRecord, 'publication[0].dateOfPublication');

    // XXX I have not seen either of these fields in the wild
    const hasISSN = !!bibRecord.issn;
    const idKey = `ui-rs.information.${hasISSN ? 'issn' : 'isbn'}`;
    const idValue = bibRecord[hasISSN ? 'issn' : 'isbn'];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.catalogInfo" />}
        closedByDefault={this.props.closedByDefault}
      >
        <Card
          id={`${this.props.id}-card`}
          headerStart="Catalog"
          roundedBorder
          cardClass={css.catalogCard}
          headerClass={css.catalogCardHeader}
        >
          <Row>
            <Col xs={12} style={{ textAlign: 'right' }}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${stripes.config.sharedIndexUI}/inventory/view/${id}`}
              >
                View Record
              </a>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.title" />}
                value={title}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.author" />}
                value={author}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id={idKey} />}
                value={idValue}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.date" />}
                value={date}
              />
            </Col>
          </Row>
        </Card>
      </Accordion>
    );
  }
}

export default withStripes(CatalogInfo);
