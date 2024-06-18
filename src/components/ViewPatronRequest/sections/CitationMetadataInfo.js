import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
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
              label={<FormattedMessage id="ui-rs.information.titleOfComponent" />}
              value={record.titleOfComponent}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.author" />}
              value={record.author}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.authorOfComponent" />}
              value={record.authorOfComponent}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.edition" />}
              value={record.edition}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id={idKey} />}
              value={idValue}
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
              label={<FormattedMessage id="ui-rs.information.date" />}
              value={record.publicationDate}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.volume" />}
              value={record.volume}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.issue" />}
              value={record.issue}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.pages" />}
              value={record.pagesRequested}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default CitationMetadataInfo;
