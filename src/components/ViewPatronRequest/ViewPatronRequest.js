import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import {
  AccordionSet,
  Accordion,
  Icon,
  Pane,
  Layer,
  Button,
} from '@folio/stripes/components';

import EditPatronRequest from '../EditPatronRequest';

import {
  RequestInfo,
  RequestingInstitutionInfo,
  RequestingUserInfo,
  CitationMetadataInfo,
  CatalogInfo,
  SuppliersInfo,
} from './sections';

class ViewPatronRequest extends React.Component {
  static manifest = Object.freeze({
    selectedRecord: {
      type: 'okapi',
      path: 'rs/patronrequests/:{id}',
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
      requestInfo: true,                // No card
      requestingInstitutionInfo: false, // Blue card
      requestingUserInfo: false,        // Gold card
      citationMetadataInfo: false,      // Pink card
      catalogInfo: true,                // Pale green card
      suppliersInfo: true,              // Green card
      developerInfo: false,             // No card
    }
  }

  getRecord() {
    return get(this.props.resources.selectedRecord, ['records', 0], {});
  }

  getInitialValues = () => {
    const record = this.getRecord();
    return Object.assign({}, record, { shortId: record.id && record.id.substring(0, 8) });
  }

  getSectionProps() {
    return {
      record: this.getRecord(),
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
      <FormattedMessage id="ui-rs.editPatronRequest">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditPatronRequest
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
        id="clickable-edit-patronrequest"
        onClick={() => {
          this.props.onEdit();
          onToggle();
        }}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-rs.edit" />
        </Icon>
      </Button>
    );
  }

  render() {
    const record = this.getRecord();
    const sectionProps = this.getSectionProps();
    const title = record.title || record.id;

    return (
      <Pane
        id="pane-view-patronrequest"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        actionMenu={this.getActionMenu}
      >
        <Link to={`/request/view/${record.id}/flow`}>[flow]</Link>
        <AccordionSet accordionStatus={this.state.sections}>
          <RequestInfo id="requestInfo" {...sectionProps} />
          <RequestingInstitutionInfo id="requestingInstitutionInfo" {...sectionProps} />
          <RequestingUserInfo id="requestingUserInfo" {...sectionProps} />
          <CitationMetadataInfo id="citationMetadataInfo" {...sectionProps} />
          <CatalogInfo id="catalogInfo" {...sectionProps} />
          <SuppliersInfo id="suppliersInfo" {...sectionProps} />
          <Accordion
            id="developerInfo"
            label={<FormattedMessage id="ui-rs.information.heading.developer" />}
            displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
          >
            <pre>{JSON.stringify(record, null, 2)}</pre>
          </Accordion>
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewPatronRequest;
