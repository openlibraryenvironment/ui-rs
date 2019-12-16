import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import stateString from '../../../util/stateString';
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
                value={entry.dateCreated}
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
              <KeyValue
                label="From state"
                value={stateString(entry.fromStatus)}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label="To state"
                value={stateString(entry.toStatus)}
              />
            </Col>
          </Row>
        </Card>
      ))
    );
  }
}

export default AuditInfo;
