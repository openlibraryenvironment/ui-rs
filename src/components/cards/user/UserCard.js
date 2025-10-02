import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stringify from 'json-stable-stringify';
import { Link } from 'react-router-dom';
import { withStripes } from '@folio/stripes/core';
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
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        showDevInfo: PropTypes.bool,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const props = { ...this.props };
    const patronURLTemplate = props.stripes?.config?.reshare?.patronURL;
    // React complains if any of these props are passed in <Card>
    delete props.refreshRemote;
    delete props.dataKey;
    delete props.userId;

    let user = props.user;
    const p = user.personal || {};
    if (user && (p.email || p.lastName || p.firstName)) {
      props.cardStyle = 'positive';
    } else {
      props.cardStyle = 'negative';
      delete props.headerClass;
      delete props.cardClass;
      if (!user) user = {};
    }

    let patronLink;
    if (user.id && patronURLTemplate) {
      patronLink = <Link to={patronURLTemplate.replace('{patronid}', user.id)}>{user.id}</Link>;
    }

    return (
      <Card
        id="requestingUserInfo-card"
        headerStart={<FormattedMessage id="ui-rs.user" />}
        roundedBorder
        {...props}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-rs.information.userId" />}
              value={patronLink || user.id}
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
        {!props.stripes.config.showDevInfo ? '' :
        <Row>
          <Col xs={12}>
            <Accordion
              id="requestingUserInfo-card-dev"
              label={<FormattedMessage id="ui-rs.information.heading.developer" />}
              closedByDefault
            >
              <pre>
                {stringify(user, { space: 2 })}
              </pre>
            </Accordion>
          </Col>
        </Row>
        }
      </Card>
    );
  }
}

export default withStripes(UserCard);
