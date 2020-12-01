import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  Row,
  FormattedUTCDate,
} from '@folio/stripes/components';
import formattedDateTime from '../../../util/formattedDateTime';

class RequestInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;

    return (
      <Card
        id={`${this.props.id}-card`}
        headerStart={record.id}
        roundedBorder
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.hrid" />}
              value={record.hrid}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.fullId" />}
              value={record.id}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.dateSubmitted" />}
              value={formattedDateTime(record.dateCreated)}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.lastUpdated" />}
              value={formattedDateTime(record.lastUpdated)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.dateNeeded" />}
              value={record.neededBy ? <FormattedUTCDate value={record.neededBy} /> : ''}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.pickupLocation" />}
              value={record.pickupLocation}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.notes" />}
              value={record.patronNote}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default RequestInfo;
