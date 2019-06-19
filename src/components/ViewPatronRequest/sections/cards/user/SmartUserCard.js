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
    userId: PropTypes.string,
  };

  render() {
    const { userId } = this.props;
    if (!userId) return null;

    return (
      <Card id="requestingUserInfo-card" headerStart="User">
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.fullId" />}
              value={userId}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UserCard;
