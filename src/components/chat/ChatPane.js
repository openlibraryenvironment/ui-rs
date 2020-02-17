import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Col, Pane, Row, TextField } from '@folio/stripes/components';
import { ChatMessage } from '.';


class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    mutator:PropTypes.shape({
      action: PropTypes.object,
    }),
    onToggle: PropTypes.func.isRequired,
  }

  onSubmitMessage = values => {
    return (
      this.sendMessage(
        values
      )
    );
  }

  onSubmitRead = (values) => {
    return (
      this.messageRead(
        values
      )
    );
  }

  renderPaneFooter() {
    // const patronRequest = this.props?.resources?.selectedRecord?.records[0];

    // const validActions = patronRequest?.validActions;
    // const messageValid = validActions ? validActions.includes('message') : false;
    return (
      <Form
        onSubmit={this.onSubmitMessage}
        render={({ handleSubmit, pristine }) => (
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <Row>
              <Col xs={1} />
              <Col xs={7}>
                <Field
                  name="note"
                  component={TextField}
                  autoFocus
                />
              </Col>
              <Col xs={4}>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    pristine
                    // TODO State model not complete, eventaully implement this check to see if sending message is valid
                    // !messageValid
                  }
                >
                  <FormattedMessage id="ui-rs.view.chatPane.sendMessage" />
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
    );
  }

  displayMessage(notification) {
    const { mutator } = this.props;
    return (
      <ChatMessage notification={notification} mutator={mutator} />
    );
  }


  sortByTimestamp = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    return 0;
  };

  displayMessages() {
    const { resources } = this.props;
    const notifications = resources?.selectedRecord?.records[0]?.notifications;

    if (notifications) {
      // Sort the notifications into order by time recieved/sent
      notifications.sort((a, b) => this.sortByTimestamp(a, b));

      return (
        <React.Fragment>
          {notifications.map((notification) => this.displayMessage(notification))}
        </React.Fragment>
      );
    }
    return null;
  }


  render() {
    const { resources, onToggle } = this.props;
    const isRequester = resources?.selectedRecord?.records[0]?.isRequester;
    const chatOtherParty = isRequester ? 'supplier' : 'requester';
    return (
      <Pane
        defaultWidth="30%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
        footer={this.renderPaneFooter()}
        id="chat-pane"
      >
        {this.displayMessages()}
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
