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
  IconButton,
  Layer,
  Layout,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
  ButtonGroup,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import permissionToEdit from '../../util/permissionToEdit';
import EditDirectoryEntry from '../EditDirectoryEntry';

import {
  DirectoryEntryInfo,
  ContactInformation,
  ServiceAccounts,
  CustomProperties,
} from './sectionsShared';

import {
  LocalDirectoryEntryInfo,
  LocalCustomProperties,
} from './sectionsLocal';

class ViewDirectoryEntry extends React.Component {
  static manifest = Object.freeze({
    custprops: {
      type: 'okapi',
      path: 'directory/custprops',
      shouldRefresh: () => false,
    },
    selectedRecord: {
      type: 'okapi',
      path: 'directory/entry/:{id}',
    },
    query: {},
  });

  static propTypes = {
    editLink: PropTypes.string,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
    onClose: PropTypes.func,
    onCloseEdit: PropTypes.func,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    resources: PropTypes.shape({
      custprops: PropTypes.shape({
        records: PropTypes.array,
      }),
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      selectedRecord: PropTypes.shape({
        records: PropTypes.array,
      }),
    }),
    stripes: PropTypes.object,
  };

  state = {
    sectionsShared: {
      directoryEntryInfo: true,
      contactInformation: true,
      services: false,
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

  handleToggleHelper = (helper, mutator, resources) => {
    const currentHelper = resources?.query?.helper;
    const nextHelper = currentHelper !== helper ? helper : null;
    mutator.query.update({ helper: nextHelper });
  };

  handleToggleTags = (mutator, resources) => {
    this.handleToggleHelper('tags', mutator, resources);
  };


  getCustProps() {
    const custprops = this.props.resources?.custprops?.records || [];
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

  getParentValues = () => {
    const record = Object.assign({}, this.getRecord());
    const parentRecord = { parent: record };
    return parentRecord;
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

  renderUnitLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-directory.editDirectoryEntry">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'unit'}
            contentLabel={layerContentLabel}
          >
            <EditDirectoryEntry
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.props.onCreate}
              initialValues={this.getParentValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  switchLayer(newLayer) {
    const { mutator } = this.props;
    mutator.query.replace({ layer: newLayer });
  }

  paneButtons = (mutator, resources) => {
    return (
      <PaneMenu>
        {this.handleToggleTags &&
        <FormattedMessage id="ui-rs.view.showTags">
          {ariaLabel => (
            <IconButton
              icon="tag"
              badgeCount={resources?.selectedRecord.records[0]?.tags?.length || 0}
              onClick={() => this.handleToggleTags(mutator, resources)}
              ariaLabel={ariaLabel}
            />
          )}
        </FormattedMessage>
        }
      </PaneMenu>
    );
  };

  getActionMenu = ({ onToggle }, showEditButton) => {
    return (
      <>
        {showEditButton ? (
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
        ) : null}
        <Button
          buttonStyle="dropdownItem"
          id="clickable-create-new-unit-directoryentry"
          onClick={() => {
            this.switchLayer('unit');
            onToggle();
          }}
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-directory.createUnit" />
          </Icon>
        </Button>
      </>
    );
  }

  render() {
    const { mutator, resources, stripes } = this.props;
    const record = this.getRecord();
    const sectionProps = this.getSectionProps();
    let title = record.name || 'Directory entry details';
    if (record.status) title += ` (${record.status.label})`;
    const { tab } = this.state;
    const directoryEntry = record.name || <FormattedMessage id="ui-directory.information.titleNotFound" />;
    const showEditButton = permissionToEdit(stripes, record);

    return (
      <Pane
        id="pane-view-directoryentry"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        lastMenu={this.paneButtons(mutator, resources)}
        actionMenu={(x) => this.getActionMenu(x, showEditButton)}
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
              <ContactInformation id="contactInformation" {...sectionProps} />
              <ServiceAccounts id="services" {...sectionProps} />
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
        { this.renderUnitLayer() }
      </Pane>
    );
  }
}

export default stripesConnect(ViewDirectoryEntry);
