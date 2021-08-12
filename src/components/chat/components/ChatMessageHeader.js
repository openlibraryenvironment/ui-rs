import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import css from './ChatMessage.css';


const ChatMessageHeader = ({ notification }) => {
  const longDateFormatter = (timestamp) => {
    // This takes a moment timestamp
    return `${timestamp.format('MMM. D, YYYY ')} at ${timestamp.format(' h:mm a')}`;
  };

  const renderDateTime = () => {
    const duration = moment.duration(moment().diff(moment(notification?.timestamp)));

    const { days, hours, minutes, seconds } = duration?._data || {};
    const JUST_NOW_THRESHOLD = 30;
    // If more than a day, return long date formatted
    if (days !== 0) {
      return (longDateFormatter(moment(notification?.timestamp)));
    }

    // If time in hours
    if (hours > 1) {
      return <FormattedMessage id="ui-rs.view.chatMessage.hours" values={{ hours }} />;
    }
    if (hours === 1) {
      return <FormattedMessage id="ui-rs.view.chatMessage.hour" />;
    }

    if (minutes > 1) {
      return <FormattedMessage id="ui-rs.view.chatMessage.minutes" values={{ minutes }} />;
    }

    if (minutes === 1) {
      return <FormattedMessage id="ui-rs.view.chatMessage.minute" />;
    }

    if (seconds > JUST_NOW_THRESHOLD) {
      return <FormattedMessage id="ui-rs.view.chatMessage.seconds" values={{ seconds }} />;
    }

    return <FormattedMessage id="ui-rs.view.chatMessage.justNow" />; 
  };


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

export default ChatMessageHeader;
