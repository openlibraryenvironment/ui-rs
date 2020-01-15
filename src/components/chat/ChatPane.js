import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Card, Col, Pane, Row } from '@folio/stripes/components';
import css from './ChatPane.css';


class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
  }



  renderMessageCard(notification, isSender) {
    return (
      <Card
        cardClass={isSender ? css.sentMessageCard : css.receivedMessageCard}
        headerComponent={() => null}
        roundedBorder
      >
        {notification.messageContent}
      </Card>
    );
  }

  displayMessage(notification) {
    if (notification.isSender === true) {
      return (
        <Row>
          <Col xs={6}/>
          <Col xs={6}>
            {this.renderMessageCard(notification, true)}
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col xs={6}>
            {this.renderMessageCard(notification, false)}
          </Col>
          <Col xs={6}/>
        </Row>
      );
    }
  }



  displayMessages() {
    const { resources } = this.props;
    const notifications = _.get(resources, 'selectedRecord.records[0].notifications');
    if (notifications) {

      // Sort the notifications into order by time recieved/sent
      notifications.sort((a,b) => {
        if (a.timestamp > b.timestamp) {
          return 1;
        }
        if (a.timestamp < b.timestamp) {
          return -1;
        }
        return 0;
      });

      return (
        notifications.map(notification => this.displayMessage(notification))
      );
    }
    return null;
  }


  render() {
    const { resources, onToggle } = this.props;
    const isRequester = _.get(resources, 'selectedRecord.records[0].isRequester');
    const chatOtherParty = isRequester ? 'supplier' : 'requester';

    console.log("Resources %o", resources)
    console.log("Notifications %o", _.get(resources, 'selectedRecord.records[0].notifications'))
    return (
      <Pane
        defaultWidth="20%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
      >
        {this.displayMessages()}
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
