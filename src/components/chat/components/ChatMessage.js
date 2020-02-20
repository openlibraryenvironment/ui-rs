import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, DropdownMenu, IconButton } from '@folio/stripes/components';
import moment from 'moment';
import css from './ChatMessage.css';


class ChatMessage extends React.Component {
  static propTypes = {
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
      })
    }),
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
  }

  longDateFormatter = (timestamp) => {
    // This takes a moment timestamp
    return `${timestamp.format('MMM. D, YYYY ')} at ${timestamp.format(' h:mm a')}`;
  }

  renderDateTime() {
    const timestamp = this.props?.notification?.timestamp;

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
      return (this.longDateFormatter(timestampDate));
    }
  }

  renderHeader() {
    const notification = this.props?.notification;
    return (
      <div
        className={css.header}
      >
        <b>
          {notification?.messageSender?.owner?.name}
        </b>
        <span className={css.headerTime}>&nbsp;</span>
        <span className={css.headerTime}>
          {this.renderDateTime()}
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
  }

  renderActionContents() {
    const notification = this.props?.notification;
    const action = notification?.attachedAction;
    const actionKey = action.charAt(0).toLowerCase() + action.substring(1);

    return (
      <>
        {
          action ? action !== 'Notification' &&
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
  }

  renderContents() {
    const notification = this.props?.notification;
    return (
      <div
        className={css.contents}
      >
        {this.renderDropdownButton()}
        {this.renderActionContents()}
        {notification.messageContent}
      </div>
    );
  }

  renderDropdownButtonContents = ({ onToggle }) => {
    const notification = this.props?.notification;
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
                onClick={() => this.handleMessageRead(notification.seen)}
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
  }

  handleMessageRead(currentReadStatus) {
    const notification = this.props?.notification;
    const id = notification?.id;

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    this.props.mutator.action.POST({ action: 'messageSeen', actionParams: (payload) || {} });
  }

  renderDropdownButton() {
    return (
      <Dropdown
        className={css.dropdownMenu}
        label={<FormattedMessage id="ui-rs.view.chatMessage.actions" />}
        renderMenu={this.renderDropdownButtonContents}
      >
        <IconButton
          data-role="toggle"
          icon="ellipsis"
        />
      </Dropdown>
    );
  }

  classOfMessageCard() {
    const notification = this.props?.notification;
    const read = notification?.seen;

    const action = notification?.attachedAction;

    let messageClassName = read ? css.read : css.unread;

    if (notification?.isSender) {
      messageClassName = null;
    }

    if (action && action !== 'Notification' && !read) {
      messageClassName = css.action;
    }

    return messageClassName;
  }


  render() {
    const notification = this.props?.notification;
    const messageClassName = this.classOfMessageCard();

    return (
      <div className={notification?.isSender ? css.messageContainerSender : css.messageContainer}>
        <div
          className={messageClassName}
        >
          {this.renderHeader()}
          {this.renderContents()}
          <hr />
        </div>
      </div>
    );
  }
}

export default ChatMessage;
