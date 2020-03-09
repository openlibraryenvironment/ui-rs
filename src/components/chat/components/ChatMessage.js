import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, DropdownMenu, IconButton } from '@folio/stripes/components';
import moment from 'moment';
import css from './ChatMessage.css';

const ChatMessage = React.forwardRef((props, ref) => {
  const { notification } = props;
  const longDateFormatter = (timestamp) => {
    // This takes a moment timestamp
    return `${timestamp.format('MMM. D, YYYY ')} at ${timestamp.format(' h:mm a')}`;
  };

  const renderDateTime = () => {
    const timestamp = notification?.timestamp;

    const currentTime = moment();
    const timestampDate = moment(timestamp);

    const duration = moment.duration(currentTime.diff(timestampDate));

    const days = duration?._data.days;
    const hours = duration?._data.hours;
    const minutes = duration?._data.minutes;
    const seconds = duration?._data.seconds;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          if (seconds < 30) {
            return <FormattedMessage id="ui-rs.view.chatMessage.justNow" />;
          } else {
            return <FormattedMessage id="ui-rs.view.chatMessage.seconds" values={{ seconds }} />;
          }
        } else if (minutes === 1) {
          return <FormattedMessage id="ui-rs.view.chatMessage.minute" />;
        } else {
          return <FormattedMessage id="ui-rs.view.chatMessage.minutes" values={{ minutes }} />;
        }
      } else if (hours === 1) {
        return <FormattedMessage id="ui-rs.view.chatMessage.hour" />;
      } else {
        return <FormattedMessage id="ui-rs.view.chatMessage.hours" values={{ hours }} />;
      }
    } else {
      return (longDateFormatter(timestampDate));
    }
  };

  const renderHeader = () => {
    return (
      <div
        className={css.header}
      >
        <b>
          {notification?.messageSender?.owner?.name}
        </b>
        <span className={css.headerTime}>&nbsp;</span>
        <span className={css.headerTime}>
          {renderDateTime()}
        </span>
        {!notification?.isSender &&
          <>
            <span className={css.headerTime}>&nbsp; &#183; &nbsp;</span>
            <span className={css.headerTime}>
              {notification?.seen ? <FormattedMessage id="ui-rs.view.chatMessage.actions.Read" /> : <b><FormattedMessage id="ui-rs.view.chatMessage.actions.Unread" /></b>}
            </span>
          </>
        }
      </div>
    );
  };

  const renderActionContents = () => {
    const action = notification?.attachedAction ? notification?.attachedAction.charAt(0).toLowerCase() + notification?.attachedAction.substring(1) : undefined;
    const actionStatus = notification?.actionStatus ? notification?.actionStatus?.charAt(0).toLowerCase() + notification?.actionStatus?.substring(1) : undefined;
    const actionData = notification?.actionData ? notification?.actionData?.charAt(0).toLowerCase() + notification?.actionData?.substring(1) : undefined;

    let loanNotification = false;

    let actionKey = action;
    if (actionStatus) {
      actionKey = `${actionKey}.${actionStatus}`;
    }
    // For now we're not displaying this information in the message
    /* if (actionData) {
      actionKey = `${actionKey}.${actionData}`;
    } */

    // If the message is a loan condition agreement then it will be prefaced by #ReShareLoanConditionAgreeResponse#. We want to display an action message in its place
    if (notification?.messageContent?.startsWith('#ReShareLoanConditionAgreeResponse#')) {
      actionKey = 'ReShareLoanConditionAgreeResponse';
      loanNotification = true;
    }

    return (
      <>
        {
          action ? (action !== 'notification' || loanNotification) &&
          <span
            className={css.actionText}
          >
            <FormattedMessage id={`ui-rs.view.withAction.${actionKey}`} />
          </span> :
            null
        }
        <span>&nbsp;</span>
      </>
    );
  };


  const renderDropdownButtonContents = () => {
    const { onToggle } = props;
    return (
      <DropdownMenu
        data-role="menu"
        aria-label="actions-for-message"
        onToggle={onToggle}
      >
        <FormattedMessage id="ui-rs.view.chatMessage.actions">
          {ariaLabel => (
            !notification?.isSender ?
              <Button
                aria-label={ariaLabel}
                buttonStyle="dropdownItem"
                id="clickable-mark-message-read"
                marginBottom0
                onClick={() => props.handleMessageRead(notification, notification.seen)}
              >
                {notification?.seen ?
                  <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsUnread" /> :
                  <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsRead" />
                }
              </Button> : <FormattedMessage id="ui-rs.view.chatMessage.actions.noAvailableActions" />
          )}
        </FormattedMessage>
      </DropdownMenu>
    );
  };

  const renderMessageContents = () => {
    let contents = notification.messageContent;

    // If the message is a loan condition agreement then it will be prefaced by #ReShareLoanConditionAgreeResponse#. We want to remove this from our reshare display
    if (notification?.messageContent?.startsWith('#ReShareLoanConditionAgreeResponse#')) {
      contents = contents.replace('#ReShareLoanConditionAgreeResponse#', '');
    }
    return contents;
  };

  const renderDropdownButton = () => {
    return (
      <Dropdown
        className={css.dropdownMenu}
        label={<FormattedMessage id="ui-rs.view.chatMessage.actions" />}
        renderMenu={renderDropdownButtonContents}
      >
        <IconButton
          data-role="toggle"
          icon="ellipsis"
        />
      </Dropdown>
    );
  };

  const renderContents = () => {
    return (
      <div
        className={css.contents}
      >
        {renderDropdownButton()}
        {renderActionContents()}
        {renderMessageContents()}
      </div>
    );
  };

  const classOfMessageCard = () => {
    const read = notification?.seen;

    const action = notification?.attachedAction;

    let messageClassName = read ? css.read : css.unread;

    if (notification?.isSender) {
      messageClassName = null;
      if (action && action !== 'Notification') {
        messageClassName = css.action;
      }
    } else if (action && action !== 'Notification' && !read) {
      messageClassName = css.action;
    }

    return messageClassName;
  };

  const messageClassName = classOfMessageCard();
  return (
    <div className={notification?.isSender ? css.messageContainerSender : css.messageContainer} ref={ref}>
      <div
        className={messageClassName}
      >
        {renderHeader()}
        {renderContents()}
        <hr />
      </div>
    </div>
  );
});

/* eslint-disable react/no-unused-prop-types */
// For some reason eslint complains when the onToggle prop is here AND when it isn't, so I'm putting it here to be safe, and shushing lint.

ChatMessage.propTypes = {
  handleMessageRead: PropTypes.func.isRequired,
  mutator:PropTypes.shape({
    action: PropTypes.object,
  }),
  notification: PropTypes.shape({
    id: PropTypes.string,
    messageContent: PropTypes.string,
    timestamp: PropTypes.number,
    seen: PropTypes.bool,
    isSender: PropTypes.bool,
    attachedAction: PropTypes.string,
    messageReceiver: PropTypes.shape({
      id: PropTypes.string,
      owner: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    }),
    messageSender: PropTypes.shape({
      id: PropTypes.string,
      owner: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    }),
  }),
  onToggle: PropTypes.func.isRequired,
};

export default ChatMessage;
