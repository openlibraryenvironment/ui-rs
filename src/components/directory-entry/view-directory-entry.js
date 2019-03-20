import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  AccordionSet,
  Accordion,
  Icon,
  Pane,
  Layer,
  Button,
} from '@folio/stripes/components';

import {
  DirectoryEntryInfo
} from './Sections';

class ViewDirectoryEntry extends React.Component {
  static manifest = Object.freeze({
    selectedDirectoryEntry: {
      type: 'okapi',
      path: 'directory/entry/:{id}',
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

  constructor(props) {
    super(props);
    this.getActionMenu = this.getActionMenu.bind(this);
  }

  state = {
    sections: {
      directoryEntryInfo: true,
      developerInfo: false,
    }
  }

  getDirectoryEntry() {
    return get(this.props.resources.selectedDirectoryEntry, ['records', 0], {});
  }

  getSectionProps() {
    return {
      directoryEntry: this.getDirectoryEntry(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <Layer
        isOpen={query.layer === 'edit'}
        contentLabel="cant get intl to work"
      />
    );
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
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  render() {
    const directoryEntry = this.getDirectoryEntry();
    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-directory-entry"
        defaultWidth={this.props.paneWidth}
        paneTitle={directoryEntry.id}
        dismissible
        onClose={this.props.onClose}
      >
        <AccordionSet accordionStatus={this.state.sections}>
          <DirectoryEntryInfo id="directoryEntryInfo" {...sectionProps} />
          <Accordion id="developerInfo" label="Developer info" {...sectionProps}
            displayWhenClosed="(Shows JSON dump of raw record)">
            <pre>{JSON.stringify(this.getDirectoryEntry(), null, 2)}</pre>
          </Accordion>
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewDirectoryEntry;
