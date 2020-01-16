import React from 'react';
import PropTypes from 'prop-types';
import {Form, Field} from 'react-final-form';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useMessage } from '../MessageModalState';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Card, Col, Pane, Row, TextField } from '@folio/stripes/components';
import css from './ChatPane.css';


class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {latestMessage: (_.get(this.props, 'resources.selectedRecord.records[0].notifications')) ? (_.get(this.props, 'resources.selectedRecord.records[0].notifications')).sort((a, b) => this.sortByTimestamp(a,b))[-1] : {}};
  }


  state
  sendMessage(payload, successMessage, errorMessage) {
    this.props.mutator.action.POST({ action: 'message', actionParams: payload || {} })
  };

  onSubmit = values => {
    return (
      this.sendMessage(
        values,
        'ui-rs.actions.sendChatMessage.success',
        'ui-rs.actions.sendChatMessage.error',
      )
    );
  }

  renderPaneFooter() {
    return(
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={8}>
                <Field
                  name="note"
                  component={TextField}
                />
              </Col>
              <Col xs={4}>
                <Button
                  onClick={handleSubmit}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.sendMessage"/>
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
    );
  }


  renderDateTime(timestamp) {
    return (
      <FormattedDate
        value={timestamp}
        day="numeric"
        month="numeric"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );
  }

  renderMessageCard(notification, isSender) {
    // TODO Eventually Card should probably be replaced by a dedicated chat message component
    return (
      <React.Fragment>
        <Row>
          <b>{_.get(notification, 'messageSender.owner.name')}</b>
        </Row>
        <Row>
          {this.renderDateTime(notification.timestamp)}
        </Row>
        <Row>
          <Card
            cardClass={isSender ? css.sentMessageCard : css.receivedMessageCard}
            id={`chat-pane-message-card-${notification.id}`}
            headerComponent={() => null}
            headerStart="Text to stop proptypes getting annoyed"
            roundedBorder
            autoFocus={notification === this.state.latestMessage}
          >
            {notification.messageContent}
          </Card>
        </Row>
      </React.Fragment>
    );
  }

  displayMessage(notification) {
    if (notification.isSender === true) {
      return (
        <Row>
          <Col xs={6} />
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
          <Col xs={6} />
        </Row>
      );
    }
  }


  sortByTimestamp = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    return 0;
  };

  displayMessages() {
    const { resources } = this.props;
    const notifications = _.get(resources, 'selectedRecord.records[0].notifications');
    //console.log("Notifications: %o", _.get(resources, 'selectedRecord.records[0].notifications'))
    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));

      return (
        <React.Fragment>
          {notifications.map(notification => this.displayMessage(notification))}
        </React.Fragment>
      );
    }
    return null;
  }


  render() {
    const { resources, onToggle } = this.props;
    const isRequester = _.get(resources, 'selectedRecord.records[0].isRequester');
    const chatOtherParty = isRequester ? 'supplier' : 'requester';
    return (
      <Pane
        defaultWidth="20%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
        footer={this.renderPaneFooter()}
      >
        {this.displayMessages()}
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
