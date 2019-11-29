import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stringify from 'json-stable-stringify';
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
    const props = Object.assign({}, this.props);
    // React complains if any of these props are passed in <Card>
    delete props.refreshRemote;
    delete props.dataKey;
    delete props.userId;

    let user = props.user;
    if (user) {
      props.cardStyle = 'positive';
    } else {
      props.cardStyle = 'negative';
      delete props.headerClass;
      delete props.cardClass;
      user = {};
    }
    const p = user.personal || {};
    const g = user.patronGroupRecord || {};

    return (
      <Card
        id="requestingUserInfo-card"
        headerStart="User"
        roundedBorder
        {...props}
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
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.patronGroup" />}
              value={`${g.group} (${g.desc})`}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.emailAddress" />}
              value={p.email}
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
                {stringify(user, { space: 2 })}
              </pre>
            </Accordion>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UserCard;
