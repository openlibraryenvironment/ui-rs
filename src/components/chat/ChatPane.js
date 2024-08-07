import React, { useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Layout, Pane, TextArea } from '@folio/stripes/components';
import { useIntlCallout, usePerformAction } from '@projectreshare/stripes-reshare';
import { ChatMessage } from './components';
import css from './ChatPane.css';
import MessageDropdown from './components/MessageDropdown';
import useChatActions from './useChatActions';

const ENTER_KEY = 13;

const ChatPane = ({
  onToggle,
  request: {
    id: reqId,
    isRequester,
    notifications,
    validActions
  } = {}
}) => {
  const latestMessage = useRef();

  const intl = useIntl();
  const performAction = usePerformAction(reqId);

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
    const messageValid = validActions?.some(a => a.actionCode === 'message');
    return (
      <Form
        onSubmit={payload => performAction('message', (payload || {}), {
          success:'ui-rs.actions.message.success',
          error:'ui-rs.actions.message.error',
          display: 'none',
          noAsync: true
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
              <Layout className="flex full">
                <div className={css.messageFieldContainer}>
                  <Field
                    className={css.messageField}
                    name="note"
                    component={TextArea}
                    onKeyDown={onEnterPress}
                    autoFocus
                    placeholder={intl.formatMessage({ id: 'ui-rs.view.chatPane.placeholder' }, { chatOtherParty: isRequester ? 'supplier' : 'requester' })}
                  />
                </div>
                <Button
                  buttonClass={css.sendButton}
                  buttonStyle="primary"
                  onClick={async event => {
                    await handleSubmit(event);
                    form.reset();
                  }}
                  disabled={pristine || !messageValid}
                >
                  <FormattedMessage id="ui-rs.view.chatPane.sendMessage" />
                </Button>
              </Layout>
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
          {notifications.length === 0 &&
            <Layout className={`padding-all-gutter flex ${css.noMessages}`}>
              <FormattedMessage id="ui-rs.view.chatPane.noMessages" />
            </Layout>
          }
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

export default ChatPane;
