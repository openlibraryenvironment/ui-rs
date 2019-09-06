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


class PatronRequestInfo extends React.Component {
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
        >
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.author" />}
                value={record.author}
              />
            </Col>
            <Col xs={2}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.date" />}
                value={record.publicationDate}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.title" />}
                value={record.title}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.publisher" />}
                value={record.publisher}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.edition" />}
                value={record.edition}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.isbn" />}
                value={record.isbn}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.issn" />}
                value={record.issn}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.volume" />}
                value={record.volume}
              />
            </Col>
          </Row>
        </Card>
      </Accordion>
    );
  }
}

export default PatronRequestInfo;
