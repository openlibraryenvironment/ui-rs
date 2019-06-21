import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class UserCard extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      // Maybe other properties
    }),
  };

  render() {
    const user = this.props.user;

    return (
      <Card id="requestingUserInfo-card" headerStart="User" roundedBorder cardStyle={user ? 'positive' : 'negative'}>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.userId" />}
              value={user && user.id}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.userName" />}
              value={user && user.username}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <pre>
              {JSON.stringify(user, null, 2)}
            </pre>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UserCard;
