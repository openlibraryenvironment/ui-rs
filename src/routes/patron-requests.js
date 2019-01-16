import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import {
  Button,
  Headline,
  Pane,
  Paneset
} from '@folio/stripes-components';

export default class PatronRequests extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { };
  }

  onClose() {
    this.toggleModal(false);
  }

  render() {
    return (
      <Paneset static>
        <Pane defaultWidth="20%" paneTitle="Examples">
          <Headline size="small">Paneset and Panes</Headline>
          These columns are created with Paneset and Pane components.
          <hr />
          <div data-test-example-page-home>
            <Link to="/rs">home page</Link>
          </div>
        </Pane>
        <Pane defaultWidth="80%" paneTitle="Some Stripes Components">
          <Headline size="small" margin="medium">Button with modal</Headline>
          <hr />
          <Headline size="small" margin="medium">More...</Headline>
        </Pane>
      </Paneset>
    );
  }
}
