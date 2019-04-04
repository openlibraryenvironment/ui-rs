import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  DirectoryEntryInfo,
  Addresses,
  Services,
  CustomProperties,
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

  state = {
    sections: {
      directoryEntryInfo: false,
      addresses: false,
      services: true,
      customProperties: false,
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
      >
        Editing ...
      </Layer>
    );
  }


  getActionMenu = ({ onToggle }) => {
    const { onEdit } = this.props;
    const handleClick = () => {
      onEdit();
      onToggle();
    };

    return (
      <Button
        data-directory-entry-edit-action
        buttonStyle="dropdownItem"
        onClick={handleClick}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-directory.edit" />
        </Icon>
      </Button>
    );
  }

  render() {
    const directoryEntry = this.getDirectoryEntry();
    const sectionProps = this.getSectionProps();
    let title = directoryEntry.name || 'Directory entry details';
    if (directoryEntry.status) title += ` (${directoryEntry.status.label})`;

    return (
      <Pane
        id="pane-view-directory-entry"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        actionMenu={this.getActionMenu}
      >
        <AccordionSet accordionStatus={this.state.sections}>
          <DirectoryEntryInfo id="directoryEntryInfo" {...sectionProps} />
          <Addresses id="addresses" {...sectionProps} />
          <Services id="services" {...sectionProps} />
          <CustomProperties id="customProperties" {...sectionProps} />
          <Accordion
            id="developerInfo"
            label={<FormattedMessage id="ui-directory.information.heading.developer" />}
            displayWhenClosed={<FormattedMessage id="ui-directory.information.heading.developer.help" />}
            {...sectionProps}
          >
            <pre>{JSON.stringify(directoryEntry, null, 2)}</pre>
          </Accordion>
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewDirectoryEntry;
