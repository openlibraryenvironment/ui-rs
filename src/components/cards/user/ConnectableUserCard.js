import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class ConnectableUserCard extends React.Component {
  static manifest = {
    user: {
      type: 'okapi',
      path: 'users/!{userId}',
    },
  };

  static propTypes = {
    userId: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.shape({
      user: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            // Maybe other properties
          }),
        ),
      }),
    }),
  };

  render() {
    const user = get(this.props, 'resources.user.records.0');

    return (
      <Card id="requestingUserInfo-card" headerStart="User" roundedBorder cardStyle={user ? 'positive' : 'negative'}>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.fullId" />}
              value={user && user.id}
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

export default ConnectableUserCard;
