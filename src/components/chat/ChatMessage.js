import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Card, Col, IconButton, Pane, Row, TextField, Tooltip } from '@folio/stripes/components';
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
    })
  }

  renderDateTime(timestamp) {
    const currentTime = moment();
    const timestampDate = moment(timestamp);

    const duration = moment.duration(currentTime.diff(timestamp));

    const days = duration?._data.days;
    const minutes = duration?._data.minutes;
    const seconds = duration?._data.seconds;

    console.log(duration)

    if (days === 0) {
      if (minutes === 0) {
        return <FormattedMessage id="ui-rs.view.chatMessage.justNow" />
      } else if (minutes === 1) {
        return <FormattedMessage id="ui-rs.view.chatMessage.minute" />;
      } else {
        return <FormattedMessage id="ui-rs.view.chatMessage.minutes" values={{ minutes }} />;
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

  render() {
    const { notification } = this.props;

    console.log("Notification: %o", notification)
    return (
      <>
        <b>{notification?.messageSender?.owner?.name} </b> {this.renderDateTime(notification?.timestamp)}
        <hr />
      </>
    );
  }
}

export default ChatMessage;
