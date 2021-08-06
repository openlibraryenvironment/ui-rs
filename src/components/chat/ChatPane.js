import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { Button, Col, Dropdown, DropdownMenu, Pane, Row, TextArea } from '@folio/stripes/components';
import { ChatMessage } from './components';
import css from './ChatPane.css';


const ENTER_KEY = 13;

class ChatPane extends React.Component {
  static propTypes = {
    request: PropTypes.shape({
      notifications: PropTypes.array,
      validActions: PropTypes.arrayOf(PropTypes.string),
    }),
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
    onToggle: PropTypes.func,
    onRequestRefresh: PropTypes.func.isRequired
  };

  static contextType = CalloutContext;

  constructor(props) {
    super(props);
    this.latestMessage = React.createRef();
  }

  componentDidMount() {
    this.jumpToLatestMessage();
    this.handleMarkAllRead(true, true);
  }

  componentDidUpdate = (prevProps) => {
    const { request: { notifications: currentNotifications } = {} } = this.props;
    const { request: { notifications: prevNotifications } = {} } = prevProps;

    if (currentNotifications?.length !== prevNotifications?.length) {
      this.scrollToLatestMessage();
    }
  };

  handleMarkAllRead(readStatus, excluding = false) {
    this.props.mutator.action.POST({ action: 'messagesAllSeen', actionParams: { seenStatus: readStatus, excludes: excluding } });
    this.props.onRequestRefresh();
  }

  handleMessageRead = (notification, currentReadStatus) => {
    const id = notification?.id;

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    this.props.mutator.action.POST({ action: 'messageSeen', actionParams: (payload) || {} });
    this.props.onRequestRefresh();
  };

  sendMessage(payload) {
    this.props.mutator.action.POST({ action: 'message', actionParams: payload || {} });
    this.props.onRequestRefresh();
  }

  onSubmitMessage = values => {
    return (
      this.sendMessage(
        values
      )
    );
  };

  renderPaneFooter() {
    const { request: { validActions } = {} } = this.props;

    const messageValid = validActions?.includes('message');
    return (
      <Form
        onSubmit={this.onSubmitMessage}
        render={({ form, handleSubmit, pristine }) => {
          const onEnterPress = async (e) => {
            if (e.keyCode === ENTER_KEY && e.shiftKey === false && !pristine) {
              e.preventDefault();
              if (messageValid) {
                await handleSubmit();
                form.reset();
              } else {
                this.context.sendCallout({ type: 'error', message: <FormattedMessage id="ui-rs.view.chatPane.stateInvalidMessage" /> });
                form.reset();
              }
            } else if (e.keyCode === ENTER_KEY && e.shiftKey === false) {
              e.preventDefault();
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
                    disabled={pristine || !messageValid}
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

  displayMessage(notification, index, isLatest = false) {
    const { mutator } = this.props;
    return (
      <ChatMessage key={`notificationMessage[${index}]`} notification={notification} mutator={mutator} isLatest={isLatest} ref={isLatest ? this.latestMessage : null} handleMessageRead={this.handleMessageRead} />
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
    const { request: { notifications } = {} } = this.props;
    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));
      const latestMessage = this.last(notifications);

      return (
        <div className={css.noTopMargin}>
          {notifications.map((notification, index) => this.displayMessage(notification, index, latestMessage.id === notification.id))}
        </div>
      );
    }
    return null;
  }

  scrollToLatestMessage() {
    return this.latestMessage?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  jumpToLatestMessage() {
    return this.latestMessage?.current?.scrollIntoView({ block: 'end' });
  }

  renderDropdownButtonContents = () => {
    const { onToggle, request: { notifications } = {} } = this.props;
    return (
      <DropdownMenu
        data-role="menu"
        aria-label="actions-for-message"
        onToggle={onToggle}
      >
        <FormattedMessage id="ui-rs.view.chatPane.actions">
          {ariaLabel => (
            notifications?.length > 0 ?
              <>
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-mark-all-message-read"
                  marginBottom0
                  onClick={() => this.handleMarkAllRead(true)}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsRead" />
                </Button>
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-mark-all-message-unread"
                  marginBottom0
                  onClick={() => this.handleMarkAllRead(false)}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsUnread" />
                </Button>
              </> : <FormattedMessage id="ui-rs.view.chatMessage.actions.noAvailableActions" />
          )}
        </FormattedMessage>
      </DropdownMenu>
    );
  };

  renderDropdownButton = () => {
    return (
      <Dropdown
        buttonProps={{ marginBottom0: true }}
        label={<FormattedMessage id="ui-rs.view.chatPane.actions" />}
        renderMenu={this.renderDropdownButtonContents}
      />
    );
  };

  render() {
    const { request: { isRequester } = {}, onToggle } = this.props;
    const chatOtherParty = isRequester ? 'supplier' : 'requester';

    return (
      <Pane
        defaultWidth="30%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
        lastMenu={this.renderDropdownButton()}
        footer={this.renderPaneFooter()}
        id="chat-pane"
      >
        {this.displayMessages()}
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
