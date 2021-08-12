import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, DropdownMenu } from '@folio/stripes/components';
import moment from 'moment';

import classNames from 'classnames';
import css from './ChatMessage.css';

const ChatMessage = React.forwardRef((props, ref) => {
  const { notification } = props;

  const lowerCaseFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const systemMessageKeys = [
    '#ReShareLoanConditionAgreeResponse#',
    '#ReShareSupplierConditionsAssumedAgreed#',
    '#ReShareSupplierAwaitingConditionConfirmation#',
    '#ReShareAddLoanCondition#'
  ];

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

    const JUST_NOW_THRESHOLD = 30;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          if (seconds < JUST_NOW_THRESHOLD) {
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
    const { attachedAction: action, actionStatus } = notification;

    let loanNotification = false;
    let actionKey = lowerCaseFirstLetter(action);
    if (actionStatus) {
      actionKey = `${actionKey}.${lowerCaseFirstLetter(actionStatus)}`;
    }

    // If the message is a loan condition agreement then it will be prefaced by one of the keys in systemMessageKeys above. We want to display an action message in its place
    const systemKey = systemMessageKeys.find(key => notification?.messageContent?.startsWith(key));
    if (systemKey) {
      actionKey = systemKey.substring(1, systemKey.length - 1);
      loanNotification = true;
    }

    // If there's no action, or this is a non-loan-notification, return null
    if (!action || (lowerCaseFirstLetter(action) === 'notification' && !loanNotification)) {
      return null;
    }

    return (
      <>
        <span
          className={css.actionText}
        >
          <FormattedMessage id={`ui-rs.view.withAction.${actionKey}`} />
        </span>
        <span>&nbsp;</span>
      </>
    );
  };

  const renderDropdownButtonContents = () => {
    const { onToggle } = props;
    const markAsReadText = notification?.seen ?
      <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsUnread" /> :
      <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsRead" />;

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
                {markAsReadText}
              </Button> : <FormattedMessage id="ui-rs.view.chatMessage.actions.noAvailableActions" />
          )}
        </FormattedMessage>
      </DropdownMenu>
    );
  };

  const renderDropdownButton = () => {
    return (
      <Dropdown
        buttonProps={{ marginBottom0: true }}
        className={css.actionButton}
        label={<FormattedMessage id="ui-rs.view.chatMessage.actions" />}
        renderMenu={renderDropdownButtonContents}
      />
    );
  };

  const renderContents = () => {
    let contents = notification.messageContent;

    // If the message is a loan condition agreement then it will be prefaced by some system key in hashes. We want to remove this from our reshare display
    if (systemMessageKeys.some(key => notification?.messageContent?.startsWith(key))) {
      const re = new RegExp('#[\\s\\S]*?#');
      contents = contents.replace(re, '');
    }

    // Sometimes there will be an action message preceding the message itself
    return (
      <div
        className={classNames(css.contents, css.displayFlex)}
      >
        {renderActionContents()}
        {contents}
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
        messageClassName = css.actionMessage;
      }
    } else if (action && action !== 'Notification' && !read) {
      messageClassName = css.actionMessage;
    }

    return messageClassName;
  };

  const className = classOfMessageCard();
  return (
    <>
      <div
        className={classNames(
          css.messageContainer,
          notification?.isSender ? css.sender : css.receiver
        )}
        ref={ref}
      >
        <div
          className={classNames(className, css.displayFlex)}
        >
          <div className={css.leftHandSide}>
            {renderHeader()}
            {renderContents()}
          </div>
          <div className={css.rightHandSide}>
            {renderDropdownButton()}
          </div>
        </div>
      </div>
    </>
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
