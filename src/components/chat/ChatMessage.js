import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Card, Col, IconButton, Pane, Row, TextField, Tooltip } from '@folio/stripes/components';
import css from './ChatMessage.css';


class ChatMessage extends React.Component {

  renderDateTime(timestamp) {
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

  render() {
    const { notification } = this.props

    console.log("Notification: %o", notification)
    return (
      <>
        <p>Hello</p>
        {this.renderDateTime(notification?.timestamp)}
        <hr />
      </>
    );
  }
}

export default ChatMessage;
