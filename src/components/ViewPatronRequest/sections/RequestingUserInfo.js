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


class RequestingUserInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.requester" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Card id="requestingUserInfo-card" headerStart="User">
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.information.fullId" />}
                value={record.patronReference}
              />
            </Col>
          </Row>
        </Card>
      </Accordion>
    );
  }
}

export default RequestingUserInfo;
