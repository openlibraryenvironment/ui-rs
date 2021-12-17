import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Button, Col, Pane, Row, TextArea } from '@folio/stripes/components';
import { useIntlCallout, usePerformAction } from '@reshare/stripes-reshare';
import { ChatMessage } from './components';
import css from './ChatPane.css';
import MessageDropdown from './components/MessageDropdown';
import useChatActions from './useChatActions';

const ENTER_KEY = 13;

const ChatPane = ({
  isOpen,
  onToggle,
  request: {
    id: reqId,
    isRequester,
    notifications,
    validActions
  } = {}
}) => {
  const latestMessage = useRef();

  const performAction = usePerformAction();

  const sendCallout = useIntlCallout();
  const { handleMarkAllRead, handleMessageRead } = useChatActions(reqId);

  const scrollToLatestMessage = () => {
    return latestMessage?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToLatestMessage = () => {
    return latestMessage?.current?.scrollIntoView({ block: 'end' });
  };

  // TODO Maybe no longer need this with hasFired
/*   const [unreadMessageCount, setUnreadMessageCount] = useState(notifications?.filter(notification => notification.seen === false && notification.isSender === false)?.length ?? 0);

  useEffect(() => {
    setUnreadMessageCount(notifications?.filter(notification => notification.seen === false && notification.isSender === false)?.length ?? 0);
  }, [notifications]); */

  // Ensure this only fires once, on mount
  useEffect(() => {
   /*  if (isOpen('chat') && unreadMessageCount > 0) {
      handleMarkAllRead(true);
    } */
    jumpToLatestMessage();
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
        onSubmit={payload => performAction('message', (payload || {}), {
          success:'ui-rs.actions.message.success',
          error:'ui-rs.actions.message.error',
          display: 'none'
        })}
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

  return (
    <Pane
      defaultWidth="30%"
      dismissible
      onClose={onToggle}
      paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty: isRequester ? 'supplier' : 'requester' }} />}
      lastMenu={
        <MessageDropdown
          actionItems={[
            {
              label: <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsRead" />,
              onClick: () => handleMarkAllRead(true)
            },
            {
              label: <FormattedMessage id="ui-rs.view.chatPane.actions.markAllAsUnread" />,
              onClick: () => handleMarkAllRead(false)
            }
          ]}
        />
      }
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
