import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';


const ChatPane = (mutator, resources) => {
  return (
    <Pane
      defaultWidth="20%"
    >
      <p> This will contain all the chat window stuff. </p>
    </Pane>
  );
};

export default stripesConnect(ChatPane);