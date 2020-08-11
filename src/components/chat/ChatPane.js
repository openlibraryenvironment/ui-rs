import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { Button, Col, Dropdown, DropdownMenu, IconButton, Pane, Row, TextArea } from '@folio/stripes/components';
import { ChatMessage } from './components';
import css from './ChatPane.css';

class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.shape({
      selectedRecord: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.shape({
          notifications: PropTypes.array,
          validActions: PropTypes.arrayOf(PropTypes.string),
        })),
      }),
    }),
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
    onToggle: PropTypes.func,
  }

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
    const { resources: { selectedRecord: { records: { 0: { notifications: currentNotifications } = {} } = [] } = {} } = {} } = this.props;
    const { resources: { selectedRecord: { records: { 0: { notifications: prevNotifications } = {} } = [] } = {} } = {} } = prevProps;
    if (currentNotifications.length !== prevNotifications.length) {
      this.scrollToLatestMessage();
    }
  }

  handleMarkAllRead(readStatus, excluding = false) {
    this.props.mutator.action.POST({ action: 'messagesAllSeen', actionParams: { seenStatus: readStatus, excludes: excluding } });
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
    const validActions = this.props?.resources?.selectedRecord?.records[0]?.validActions;
    const messageValid = validActions ? validActions.includes('message') : false;

    return (
      <Form
        onSubmit={this.onSubmitMessage}
        render={({ form, handleSubmit, pristine }) => {
          const onEnterPress = async (e) => {
            if (e.keyCode === 13 && e.shiftKey === false && !pristine) {
              e.preventDefault();
              if (messageValid) {
                await handleSubmit();
                form.reset();
              } else {
                this.context.sendCallout({ type: 'error', message: <FormattedMessage id="ui-rs.view.chatPane.stateInvalidMessage" /> });
                form.reset();
              }
            } else if (e.keyCode === 13 && e.shiftKey === false) {
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

  displayMessage(notification, isLatest = false, index) {
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
    const { resources } = this.props;
    const notifications = resources?.selectedRecord?.records[0]?.notifications;
    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));
      const latestMessage = this.last(notifications);

      return (
        <div className={css.noTopMargin}>
          {notifications.map((notification, index) => this.displayMessage(notification, latestMessage.id === notification.id, index))}
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
    const { onToggle } = this.props;
    const notifications = this.props?.resources?.selectedRecord?.records[0]?.notifications;
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
        className={css.dropdownMenu}
        label={<FormattedMessage id="ui-rs.view.chatPane.actions" />}
        renderMenu={this.renderDropdownButtonContents}
      >
        <IconButton
          data-role="toggle"
          icon="ellipsis"
        />
      </Dropdown>
    );
  };

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
