import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layer,
  Layout,
  Pane,
  Row,
} from '@folio/stripes/components';

class ViewPatronRequest extends React.Component {

 static manifest = Object.freeze({
    selectedPatronRequest: {
      type: 'okapi',
      path: 'rs/patronrequests/:{id}',
    },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  getPatronRequest() {
    return get(this.props.resources.selectedPatronRequest, ['records', 0], {});
  }


  render() {
    const patronRequest = this.getPatronRequest();

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={this.props.paneWidth}
        paneTitle='THE TITLE'
        dismissible
        onClose={this.props.onClose}
      >
        <h1>Hello</h1>
      </Pane>
    );
  }
}

export default ViewPatronRequest;
