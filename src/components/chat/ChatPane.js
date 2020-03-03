import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Col, Pane, Row, TextArea } from '@folio/stripes/components';
import { ChatMessage } from './components';
import css from './ChatPane.css';

class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
    onToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.latestMessage = React.createRef();
  }

  componentDidMount() {
    this.scrollToLatestMessage();
  }

  componentDidUpdate = (prevProps) => {
    const currentNotifications = this.props?.resources?.selectedRecord?.records[0]?.notifications;
    const prevNotifications = prevProps?.resources?.selectedRecord?.records[0]?.notifications;
    if (currentNotifications.length !== prevNotifications.length) {
      this.scrollToLatestMessage();
    }
  }

  handleMessageRead = (notification, currentReadStatus) => {
    const id = notification?.id;

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    this.props.mutator.action.POST({ action: 'messageSeen', actionParams: (payload) || {} });
  };

  sendMessage(payload) {
    this.props.mutator.action.POST({ action: 'message', actionParams: payload || {} });
  }


  onSubmitMessage = values => {
    return (
      this.sendMessage(
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
        render={({ form, handleSubmit, pristine }) => {
          const onEnterPress = async (e) => {
            if (e.keyCode === 13 && e.shiftKey === false) {
              e.preventDefault();
              await handleSubmit();
              form.reset();
            }
          };

          return (
            <form
              id="chatPaneMessageForm"
              onSubmit={async event => {
                await handleSubmit(event);
                form.reset();
              }}
              autoComplete="off"
            >
              <Row>
                <Col xs={1} />
                <Col xs={7}>
                  <Field
                    name="note"
                    component={TextArea}
                    onKeyDown={onEnterPress}
                    autoFocus
                  />
                </Col>
                <Col xs={4}>
                  <Button
                    onClick={async event => {
                      await handleSubmit(event);
                      form.reset();
                    }}
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
          );
        }}
      />
    );
  }

  displayMessage(notification, isLatest = false) {
    const { mutator } = this.props;
    return (
      <ChatMessage notification={notification} mutator={mutator} isLatest={isLatest} ref={isLatest ? this.latestMessage : null} handleMessageRead={this.handleMessageRead} />
    );
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

  last(array) {
    return array[array.length - 1];
  }

  displayMessages() {
    const { resources } = this.props;
    const notifications = resources?.selectedRecord?.records[0]?.notifications;

    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));
      const latestMessage = this.last(notifications);

      return (
        <div className={css.noTopMargin}>
          {notifications.map((notification) => this.displayMessage(notification, latestMessage.id === notification.id))}
        </div>
      );
    }
    return null;
  }

  scrollToLatestMessage() {
    return this.latestMessage?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
