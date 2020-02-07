import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import formattedDateTime from './formattedDateTime';
import css from './AuditInfo.css';


class AuditInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;

    return (
      ((record || {}).audit || []).map((entry, i) => (
        <Card
          key={i}
          id={`${this.props.id}-card`}
          headerStart={`Entry ${i + 1}`}
          roundedBorder
          cardClass={css.auditCard}
          headerClass={css.auditCardHeader}
        >
          <Row>
            <Col xs={6}>
              <KeyValue
                label="Date"
                value={formattedDateTime(entry.dateCreated)}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label="Message"
                value={entry.message}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              {entry.fromStatus && (
                <KeyValue label="From state">
                  <FormattedMessage id={`ui-rs.states.${entry.fromStatus.code}`} />
                </KeyValue>
              )}
            </Col>
            <Col xs={6}>
              {entry.toStatus && (
                <KeyValue label="To state">
                  <FormattedMessage id={`ui-rs.states.${entry.toStatus.code}`} />
                </KeyValue>
              )}
            </Col>
          </Row>
        </Card>
      ))
    );
  }
}

export default AuditInfo;
