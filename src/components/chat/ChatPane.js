import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedDate, FormattedMessage } from 'react-intl';
import _ from 'lodash';
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

  messageSeen(payload) {
    this.props.mutator.action.POST({ action: 'messageSeen', actionParams: (payload) || {} });
  }

  onSubmitMessage = values => {
    return (
      this.sendMessage(
        values
      )
    );
  }

  onSubmitSeen = (values) => {
    return (
      this.messageSeen(
        values
      )
    );
  }

  renderPaneFooter() {
    // const patronRequest = _.get(this.props, 'resources.selectedRecord.records[0]');

    // const validActions = _.get(patronRequest, 'validActions');
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

  renderSeenButton(notification) {
    return (
      <Form
        onSubmit={this.onSubmitSeen}
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
                        <FormattedMessage id="ui-rs.view.chatPane.markUnseen" /> :
                        <FormattedMessage id="ui-rs.view.chatPane.markSeen" />
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
          >
            <Row>
              {notification.messageContent}
            </Row>
            {!isSender &&
              <Row>
                <Col xs={8} />
                <Col xs={2}>
                  {this.renderSeenButton(notification)}
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
    const isRequester = _.get(resources, 'selectedRecord.records[0].isRequester');
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
