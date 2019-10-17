import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


class RequestInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    closedByDefault: PropTypes.bool,
  };

  render() {
    const { record } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.request" />}
        closedByDefault={this.props.closedByDefault}
      >
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.shortId" />}
              value={record.id && record.id.substring(0, 8)}
            />
          </Col>
          <Col xs={9}>
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
              value={record.dateCreated}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.dateNeeded" />}
              value={record.neededBy}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default RequestInfo;
