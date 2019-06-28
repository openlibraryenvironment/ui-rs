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

class UserCard extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      // Maybe other properties
    }),
  };

  render() {
    const user = this.props.user || {};
    const p = user.personal || {};

    return (
      <Card
        id="requestingUserInfo-card"
        headerStart="User"
        roundedBorder
        cardStyle={user ? 'positive' : 'negative'}
        {...this.props}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.userId" />}
              value={user.id}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.userName" />}
              value={user.username}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.lastName" />}
              value={p.lastName}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.firstName" />}
              value={p.firstName}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Accordion
              id="requestingUserInfo-card-dev"
              label={<FormattedMessage id="ui-rs.information.devInfo" />}
              closedByDefault
            >
              <pre>
                {JSON.stringify(user, null, 2)}
              </pre>
            </Accordion>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UserCard;
