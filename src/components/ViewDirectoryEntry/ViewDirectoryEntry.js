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

import EditDirectoryEntry from '../EditDirectoryEntry';

import {
  DirectoryEntryInfo,
  Addresses,
  Services,
  CustomProperties,
} from './sections';

class ViewDirectoryEntry extends React.Component {
  static manifest = Object.freeze({
    selectedRecord: {
      type: 'okapi',
      path: 'directory/entry/:{id}',
    },
    query: {},
  });

  static propTypes = {
    stripes: PropTypes.object,
    resources: PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      selectedRecord: PropTypes.shape({
        records: PropTypes.array,
      }),
    }),
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    onCloseEdit: PropTypes.func,
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

  getRecord() {
    return get(this.props.resources.selectedRecord, ['records', 0], {});
  }

  getInitialValues = () => {
    const record = Object.assign({}, this.getRecord());

    /*
    const { customProperties = {}, orgs, status, type } = record;
    if (status && status.id) {
      record.status = status.id;
    }

    if (type && type.id) {
      record.type = type.id;
    }

    if (orgs && orgs.length) {
      record.orgs = orgs.map(o => ({ ...o, role: o.role.id }));
    }

    const defaultCustomProperties = get(this.props.defaultDirectoryEntryValues, ['customProperties'], {});
    record.customProperties = {
      ...defaultCustomProperties,
      ...customProperties,
    };
    */

    return record;
  }

  getSectionProps() {
    return {
      directoryEntry: this.getRecord(),
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
      <FormattedMessage id="ui-directory.editDirectoryEntry">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditDirectoryEntry
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.handleSubmit}
              initialValues={this.getInitialValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  getActionMenu = ({ onToggle }) => {
    return (
      <Button
        buttonStyle="dropdownItem"
        href={this.props.editLink}
        id="clickable-edit-directoryentry"
        onClick={() => {
          this.props.onEdit();
          onToggle();
        }}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-directory.edit" />
        </Icon>
      </Button>
    );
  }

  render() {
    const record = this.getRecord();
    const sectionProps = this.getSectionProps();
    let title = record.name || 'Directory entry details';
    if (record.status) title += ` (${record.status.label})`;

    return (
      <Pane
        id="pane-view-directoryentry"
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
            <pre>{JSON.stringify(record, null, 2)}</pre>
          </Accordion>
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewDirectoryEntry;
