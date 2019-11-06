import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  AccordionSet,
  Accordion,
  Button,
  Col,
  Icon,
  Layer,
  Layout,
  MessageBanner,
  Pane,
  Row,
  ButtonGroup,
} from '@folio/stripes/components';

import EditDirectoryEntry from '../EditDirectoryEntry';

import {
  DirectoryEntryInfo,
  Addresses,
  Services,
  CustomProperties,
} from './sectionsShared';

import {
  LocalDirectoryEntryInfo,
  LocalCustomProperties,
} from './sectionsLocal';

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
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parentResources: PropTypes.shape({
      custprops: PropTypes.array,
    }),
    editLink: PropTypes.string,
    onCloseEdit: PropTypes.func,
  };

  state = {
    sectionsShared: {
      directoryEntryInfo: false,
      addresses: false,
      services: true,
      customProperties: false,
      developerInfo: false,
    },
    sectionsLocal: {
      localDirectoryEntryInfo: false,
      localCustomProperties: false,
    },
    tab: 'shared',
  }

  getRecord() {
    return get(this.props.resources.selectedRecord, ['records', 0], {});
  }

  getCustProps() {
    const custprops = this.props.parentResources.custprops;
    const arrayToObject = (array, keyField) => array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});
    return arrayToObject(custprops, 'name');
  }

  getInitialValues = () => {
    const record = Object.assign({}, this.getRecord());
    return record;
  }

  getSectionProps() {
    return {
      record: this.getRecord(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
      custprops: this.getCustProps(),
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sectionsShared: {
        ...prevState.sectionsShared,
        [id]: !prevState.sectionsShared[id],
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
    const { tab } = this.state;
    const directoryEntry = record.name || <FormattedMessage id="ui-directory.information.titleNotFound" />;
    return (
      <Pane
        id="pane-view-directoryentry"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        actionMenu={this.getActionMenu}
      >
        <Layout className="textCentered">
          <ButtonGroup>
            <Button
              onClick={() => this.setState({ tab: 'shared' })}
              buttonStyle={tab === 'shared' ? 'primary' : 'default'}
              id="clickable-nav-shared"
            >
              <FormattedMessage id="ui-directory.information.tab.shared" />
            </Button>
            <Button
              onClick={() => this.setState({ tab: 'local' })}
              buttonStyle={tab === 'local' ? 'primary' : 'default'}
              id="clickable-nav-local"
            >
              <FormattedMessage id="ui-directory.information.tab.local" />
            </Button>
          </ButtonGroup>
        </Layout>
        {tab === 'shared' &&
          <React.Fragment>
            <Row>
              <Col xs={12} lgOffset={1} lg={10}>
                <MessageBanner>
                  <FormattedMessage id="ui-directory.information.heading.display-text" values={{ directory_entry: directoryEntry }} />
                </MessageBanner>
              </Col>
            </Row>
            <AccordionSet accordionStatus={this.state.sectionsShared}>
              <DirectoryEntryInfo id="directoryEntryInfo" {...sectionProps} />
              <Addresses id="addresses" {...sectionProps} />
              <Services id="services" {...sectionProps} />
              <CustomProperties id="customProperties" {...sectionProps} />
              <Accordion
                id="developerInfo"
                label={<FormattedMessage id="ui-directory.information.heading.developer" />}
                displayWhenClosed={<FormattedMessage id="ui-directory.information.heading.developer.help" />}
              >
                <pre>{JSON.stringify(record, null, 2)}</pre>
              </Accordion>
            </AccordionSet>
          </React.Fragment>
        }
        {tab === 'local' &&
          <React.Fragment>
            <Row>
              <Col xs={12} lgOffset={1} lg={10}>
                <MessageBanner>
                  <FormattedMessage id="ui-directory.information.local.heading.display-text" />
                </MessageBanner>
              </Col>
            </Row>
            <AccordionSet accordionStatus={this.state.sectionsLocal}>
              <LocalDirectoryEntryInfo id="localDirectoryEntryInfo" {...sectionProps} />
              <LocalCustomProperties id="localCustomProperties" {...sectionProps} />
            </AccordionSet>
          </React.Fragment>
        }
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewDirectoryEntry;
