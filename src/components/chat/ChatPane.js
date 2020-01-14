import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';


class ChatPane extends React.Component {
  static propTypes = {
    resources: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
  }

  render() {
    const { resources, onToggle } = this.props;
    const isRequester = _.get(resources, 'selectedRecord.records[0].isRequester');
    const chatOtherParty = isRequester ? 'supplier' : 'requester';
    return (
      <Pane
        defaultWidth="20%"
        dismissible
        onClose={onToggle}
        paneTitle={<FormattedMessage id="ui-rs.view.chatPane" values={{ chatOtherParty }} />}
      >
        <p> This will contain all the chat window stuff. </p>
      </Pane>
    );
  }
}

export default stripesConnect(ChatPane);
