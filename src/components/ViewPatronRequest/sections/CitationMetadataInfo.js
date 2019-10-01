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

import css from './CitationMetadata.css';

class CitationMetadataInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;
    let summary = record.title || '[UNKNOWN]';
    let author = record.author;
    const date = record.publicationDate;
    if (date) author = `${author} (${date})`;
    if (record.author) summary = `${author}: ${summary}`;

    const hasISSN = !!record.issn;
    const idKey = `ui-rs.information.${hasISSN ? 'issn' : 'isbn'}`;
    const idValue = record[hasISSN ? 'issn' : 'isbn'];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.citationMetadata" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Card
          id={`${this.props.id}-card`}
          headerStart={summary}
          roundedBorder
          cardClass={css.citationMetadataCard}
          headerClass={css.citationMetadataCardHeader}
        >
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.title" />}
                value={record.title}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.author" />}
                value={record.author}
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
                value={record.publicationDate}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.publisher" />}
                value={record.publisher}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.edition" />}
                value={record.edition}
              />
            </Col>
          </Row>
        </Card>
      </Accordion>
    );
  }
}

export default CitationMetadataInfo;
