import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import ChatMessageHeader from './ChatMessageHeader';
import css from './ChatMessage.css';
import MessageDropdown from './MessageDropdown';

const systemMessageKeys = [
  '#ReShareLoanConditionAgreeResponse#',
  '#ReShareSupplierConditionsAssumedAgreed#',
  '#ReShareSupplierAwaitingConditionConfirmation#',
  '#ReShareAddLoanCondition#'
];

const ChatMessage = React.forwardRef((props, ref) => {
  const { notification } = props;

  const lowerCaseFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
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
  const markAsReadText = notification?.seen ?
    <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsUnread" /> :
    <FormattedMessage id="ui-rs.view.chatMessage.actions.markAsRead" />;
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
            <ChatMessageHeader notification={notification} />
            {renderContents()}
          </div>
          <div className={css.rightHandSide}>
            {!notification?.isSender &&
              <MessageDropdown
                actionItems={[
                  {
                    label: markAsReadText,
                    onClick: () => props.handleMessageRead(notification, notification.seen)
                  }
                ]}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
});

ChatMessage.propTypes = {
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
  })
};

export default ChatMessage;
