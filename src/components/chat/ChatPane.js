import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Dropdown, DropdownMenu, Pane, Row, TextArea } from '@folio/stripes/components';
import { ChatMessage } from './components';
import { useRSCallout } from '../MessageModalState';
import css from './ChatPane.css';


const ENTER_KEY = 13;

const ChatPane = ({
  onToggle,
  performAction,
  request: {
    isRequester,
    notifications,
    validActions
  } = {}
}) => {
  const latestMessage = useRef();
  const sendCallout = useRSCallout();

  const scrollToLatestMessage = () => {
    return latestMessage?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToLatestMessage = () => {
    return latestMessage?.current?.scrollIntoView({ block: 'end' });
  };

  const handleMarkAllRead = (readStatus, excluding = false) => {
    const successKey = readStatus ? 'ui-rs.actions.messagesAllSeen.success' : 'ui-rs.actions.messagesAllUnseen.success';
    const errorKey = readStatus ? 'ui-rs.actions.messagesAllSeen.error' : 'ui-rs.actions.messagesAllUnseen.error';
    performAction('messagesAllSeen', { seenStatus: readStatus, excludes: excluding }, successKey, errorKey, 'none');
  };

  const handleMessageRead = (notification, currentReadStatus) => {
    const id = notification?.id;

    const successKey = currentReadStatus ? 'ui-rs.actions.messageSeen.success' : 'ui-rs.actions.messageUnseen.success';
    const errorKey = currentReadStatus ? 'ui-rs.actions.messageSeen.error' : 'ui-rs.actions.messageUnseen.error';

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    performAction('messageSeen', payload, successKey, errorKey, 'none');
  };

  // Ensure this only fires once, on mount
  useEffect(() => {
    jumpToLatestMessage();
    handleMarkAllRead(true, true);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  // Track if new notification has arrived, and if so scroll to it
  const [notificationCount, setNotificationCount] = useState(notifications?.length);
  useEffect(() => {
    if (notificationCount !== notifications?.length) {
      scrollToLatestMessage();
      setNotificationCount(notifications?.length);
    }
  }, [notificationCount, notifications, setNotificationCount]);

  const renderPaneFooter = () => {
    const messageValid = validActions?.includes('message');
    return (
      <Form
        onSubmit={payload => performAction('message', (payload || {}), 'ui-rs.actions.message.success', 'ui-rs.actions.message.error', 'none')}
        render={({ form, handleSubmit, pristine }) => {
          const onEnterPress = async (e) => {
            if (e.keyCode === ENTER_KEY && e.shiftKey === false && !pristine) {
              e.preventDefault();
              if (messageValid) {
                await handleSubmit();
                form.reset();
              } else {
                sendCallout('ui-rs.view.chatPane.stateInvalidMessage', 'error');
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
  };

  const displayMessages = () => {
    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => a.timestamp - b.timestamp);

      return (
        <div className={css.noTopMargin}>
          {notifications.map((notification, index) => (
            <ChatMessage
              key={`notificationMessage[${index}]`}
              notification={notification}
              ref={index === notifications.length - 1 ? latestMessage : null}
              handleMessageRead={handleMessageRead}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const renderDropdownButtonContents = () => {
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
                  onClick={() => handleMarkAllRead(true)}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsRead" />
                </Button>
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-mark-all-message-unread"
                  marginBottom0
                  onClick={() => handleMarkAllRead(false)}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsUnread" />
                </Button>
              </> : <FormattedMessage id="ui-rs.view.chatMessage.actions.noAvailableActions" />
          )}
        </FormattedMessage>
      </DropdownMenu>
    );
  };

  const renderDropdownButton = () => {
    return (
      <Dropdown
        buttonProps={{ marginBottom0: true }}
        label={<FormattedMessage id="ui-rs.view.chatPane.actions" />}
        renderMenu={renderDropdownButtonContents}
      />
    );
  };

  return (
    <Pane
      defaultWidth="30%"
      dismissible
      onClose={onToggle}
      paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty: isRequester ? 'supplier' : 'requester' }} />}
      lastMenu={renderDropdownButton()}
      footer={renderPaneFooter()}
      id="chat-pane"
    >
      {displayMessages()}
    </Pane>
  );
};

ChatPane.propTypes = {
  request: PropTypes.shape({
    notifications: PropTypes.array,
    validActions: PropTypes.arrayOf(PropTypes.string),
  }),
  onToggle: PropTypes.func,
};

export default ChatPane;
