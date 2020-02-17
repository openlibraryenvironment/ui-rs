import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Button, Dropdown, DropdownMenu, IconButton } from '@folio/stripes/components';
import moment from 'moment';
import css from './ChatMessage.css';


class ChatMessage extends React.Component {
  static propTypes = {
    notification: PropTypes.shape({
      id: PropTypes.string,
      messageContent: PropTypes.string,
      timestamp: PropTypes.string,
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

  renderDateTime() {
    const timestamp = this.props?.notification?.timestamp;
    const currentTime = moment();
    const timestampDate = moment(timestamp);

    const duration = moment.duration(currentTime.diff(timestampDate));

    const days = duration?._data.days;
    const hours = duration?._data.hours;
    const minutes = duration?._data.minutes;

    // This could potentially cause problems when we have messages crossing timezones, unsure how to test

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return <FormattedMessage id="ui-rs.view.chatMessage.justNow" />;
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
      return (
        <FormattedDate
          value={timestamp}
          day="numeric"
          month="numeric"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
      );
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
        <span className={css.headerTime}>&nbsp; &#183; &nbsp;</span>
        <span className={css.headerTime}>
          {notification?.seen ? 'Read' : <b>Unread</b>}
        </span>
      </div>
    );
  }

  renderContents() {
    const notification = this.props?.notification;
    return (
      <div
        className={css.contents}
      >
        {this.renderDropdownButton()}
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
            </Button>
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


  render() {
    const notification = this.props?.notification;
    const read = notification?.seen;
    return (
      <div
        className={read ? css.read : css.unread}
      >
        {this.renderHeader()}
        {this.renderContents()}
        <hr />
      </div>
    );
  }
}

export default ChatMessage;
