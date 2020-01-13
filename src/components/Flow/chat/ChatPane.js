import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';


class ChatPane extends React.Component {
  
render () {
 const { mutator, resources, onToggle } = this.props;
  return (
    <Pane
      defaultWidth="20%"
      dismissible
      onClick={onToggle}
    >
      <p> This will contain all the chat window stuff. </p>
    </Pane>
  );
};
}

export default stripesConnect(ChatPane);