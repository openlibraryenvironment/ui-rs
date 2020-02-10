import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Card, Col, IconButton, Pane, Row, TextField, Tooltip } from '@folio/stripes/components';
import css from './ChatPane.css';


class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
    onToggle: PropTypes.func.isRequired,
  }

  sendMessage(payload) {
    this.props.mutator.action.POST({ action: 'message', actionParams: payload || {} });
  }

  messageRead(payload) {
    this.props.mutator.action.POST({ action: 'messageSeen', actionParams: (payload) || {} });
  }

  onSubmitMessage = values => {
    return (
      this.sendMessage(
        values
      )
    );
  }

  onSubmitRead = (values) => {
    return (
      this.messageRead(
        values
      )
    );
  }

  renderPaneFooter() {
    // const patronRequest = this.props?.resources?.selectedRecord?.records[0];

    // const validActions = patronRequest?.validActions;
    // const messageValid = validActions ? validActions.includes('message') : false;
    return (
      <Form
        onSubmit={this.onSubmitMessage}
        render={({ handleSubmit, pristine }) => (
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <Row>
              <Col xs={1} />
              <Col xs={7}>
                <Field
                  name="note"
                  component={TextField}
                  autoFocus
                />
              </Col>
              <Col xs={4}>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    pristine
                    // TODO State model not complete, eventaully implement this check to see if sending message is valid
                    // !messageValid
                  }
                >
                  <FormattedMessage id="ui-rs.view.chatPane.sendMessage" />
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
    );
  }

  renderReadButton(notification) {
    return (
      <Form
        onSubmit={this.onSubmitRead}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="seenStatus"
              type="checkbox"
              initialValue={notification.seen}
              component={({ input }) => {
                return (
                  <Tooltip
                    id={`seen-button-${notification.id}-tooltip`}
                    text={
                      notification.seen ?
                        <FormattedMessage id="ui-rs.view.chatPane.markUnread" /> :
                        <FormattedMessage id="ui-rs.view.chatPane.markRead" />
                    }
                  >
                    {({ ref, ariaIds }) => (
                      <IconButton
                        ref={ref}
                        icon={notification.seen ? 'eye-open' : 'eye-closed'}
                        aria-labelledby={ariaIds.text}
                        onClick={(event) => {
                          input.onChange({
                            target: {
                              type: 'checkbox',
                              checked: !input.checked
                            }
                          });
                          handleSubmit(event);
                        }}
                      />
                    )}
                  </Tooltip>
                );
              }
              }
            />
            <Field
              name="id"
              type="hidden"
              component={({ input }) => {
                return (
                  input.onChange({
                    target: {
                      type: 'hidden',
                      value: notification.id
                    }
                  }),
                  null
                );
              }}
            />
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

  renderMessageData(notification, isSender) {
    if (isSender) {
      return (
        <React.Fragment>
          <Row end="xs">
            <Col>
              <b>{notification?.messageSender?.owner?.name}</b>
            </Col>
          </Row>
          <Row end="xs">
            <Col>
              {this.renderDateTime(notification?.timestamp)}
            </Col>
          </Row>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Row>
            <Col>
              <b>{notification?.messageSender?.owner?.name}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              {this.renderDateTime(notification?.timestamp)}
            </Col>
          </Row>
        </React.Fragment>
      );
    }
  }

  renderMessageCard(notification, isSender) {
    // TODO Eventually Card should probably be replaced by a dedicated chat message component
    const action = notification?.attachedAction;
    const actionKey = action.charAt(0).toLowerCase() + action.substring(1);
    return (
      <React.Fragment>
        {this.renderMessageData(notification, isSender)}
        <Row>
          <Card
            cardClass={action !== 'Notification' ? css.actionMessageCard : (isSender ? css.sentMessageCard : css.receivedMessageCard)}
            id={`chat-pane-message-card-${notification.id}`}
            headerComponent={() => null}
            headerStart="Text to stop proptypes getting annoyed"
            roundedBorder
          >
            {notification?.attachedAction ? notification?.attachedAction !== 'Notification' &&
              <span
                className={css.actionText}
              >
                <FormattedMessage id={`ui-rs.view.withAction.${actionKey}`} />
              </span> :
              null
            }
            <Row>
              {notification.messageContent}
            </Row>
            {!isSender &&
              <Row>
                <Col xs={8} />
                <Col xs={2}>
                  {this.renderReadButton(notification)}
                </Col>
                <Col xs={2} />
              </Row>
            }
          </Card>
        </Row>
      </React.Fragment>
    );
  }

  displayMessage(notification) {
    if (notification.isSender === true) {
      return (
        <Row>
          <Col xs={2} />
          <Col xs={10}>
            {this.renderMessageCard(notification, true)}
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col xs={10}>
            {this.renderMessageCard(notification, false)}
          </Col>
          <Col xs={2} />
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
    const notifications = resources?.selectedRecord?.records[0]?.notifications;

    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));

      return (
        <React.Fragment>
          {notifications.map((notification) => this.displayMessage(notification))}
        </React.Fragment>
      );
    }
    return null;
  }


  render() {
    const { resources, onToggle } = this.props;
    const isRequester = resources?.selectedRecord?.records[0]?.isRequester;
    const chatOtherParty = isRequester ? 'supplier' : 'requester';
    return (
      <Pane
        defaultWidth="30%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
        footer={this.renderPaneFooter()}
        id="chat-pane"
      >
        {this.displayMessages()}
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
