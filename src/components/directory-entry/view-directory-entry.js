import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Icon,
  Pane,
  Button,
} from '@folio/stripes/components';

class ViewDirectoryEntry extends React.Component {

  static manifest = Object.freeze({
    selectedDirectoryEntry: {
      type: 'okapi',
      path: 'directory/entry/:{id}',
    },
    query: {},
  });

  static propTypes = {
    onClose: PropTypes.func,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  constructor(props) {
    super(props);
    this.getActionMenu = this.getActionMenu.bind(this);
  }

  getDirectoryEntry() {
    return get(this.props.resources.selectedDirectoryEntry, ['records', 0], {});
  }

  getActionMenu({ onToggle }) {
    const items = [];
    /**
     * We only want to render the action menu
     * if we have something to show
     */
    if (!items.length) {
      return null;
    }

    /**
     * Return action menu
     */
    return (
      <Fragment>
        {items.map((item, index) => (
          <Button
            key={index}
            buttonStyle="dropdownItem"
            id={item.id}
            aria-label={item.ariaLabel}
            href={item.href}
            onClick={() => {
              // Toggle the action menu dropdown
              onToggle();
              item.onClick();
            }}
          >
            <Icon icon={item.icon}>
              {item.label}
            </Icon>
          </Button>
        ))}
      </Fragment>
    );
  }


  render() {
    const directoryEntry = this.getDirectoryEntry();

    return (
      <Pane
        id="pane-view-directory-entry"
        defaultWidth={this.props.paneWidth}
        paneTitle={directoryEntry.id}
        dismissible
        onClose={this.props.onClose}
      >
        <h1>Hello</h1>
	<p>
	    {JSON.stringify(this.getDirectoryEntry())}
	</p>
      </Pane>
    );
  }
}

export default ViewDirectoryEntry;
