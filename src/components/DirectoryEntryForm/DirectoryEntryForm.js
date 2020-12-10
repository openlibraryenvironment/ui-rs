import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  ButtonGroup,
  Col,
  ExpandAllButton,
  Layout,
  MessageBanner,
  Row,
} from '@folio/stripes/components';

import {
  DirectoryEntryFormInfo,
  DirectoryEntryFormContactInfo,
  DirectoryEntryFormCustProps,
  DirectoryEntryFormServices
} from './sectionsShared';

import {
  LocalDirectoryEntryFormInfo,
} from './sectionsLocal';

class DirectoryEntryForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    parentResources: PropTypes.object,
    resources: PropTypes.shape({
      selectedRecord: PropTypes.shape({
        records: PropTypes.array,
      }),
    }),
    values: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { stripes } = props;
    this.localOnly = (stripes.hasPerm('ui-directory.edit-local') &&
                      !stripes.hasPerm('ui-directory.edit-all') &&
                      !(stripes.hasPerm('ui-directory.edit-self')));

    this.state = {
      sectionsShared: {
        directoryEntryFormInfo: true,
        directoryEntryFormContactInfo: true,
        directoryEntryFormServices: false,
        directoryEntryFormCustProps: false,
      },
      sectionsLocal: {
        localDirectoryEntryFormInfo: this.localOnly,
      },
      tab: this.localOnly ? 'local' : 'shared',
    };
  }

  getSectionProps() {
    const { form } = this.props;
    return {
      form,
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sectionsShared: {
        ...prevState.sectionsShared,
        [id]: !prevState.sectionsShared[id],
      },
      sectionsLocal: {
        ...prevState.sectionsLocal,
        [id]: !prevState.sectionsLocal[id],
      }
    }));
  }

  handleAllSectionsToggleShared = (sectionsShared) => {
    this.setState({ sectionsShared });
  }

  handleAllSectionsToggleLocal = (sectionsLocal) => {
    this.setState({ sectionsLocal });
  }

  render() {
    const sectionProps = this.getSectionProps();
    const { sectionsShared, sectionsLocal, tab } = this.state;

    const selectedRecord = this.props.resources ? this.props.resources.selectedRecord : {};
    let name;
    if (selectedRecord) {
      if (selectedRecord.records) {
        if (selectedRecord.records[0]) {
          name = selectedRecord.records[0].fullyQualifiedName;
        }
      }
    } else {
      name = 'this institution';
    }
    return (
      <div>
        <Layout className="textCentered">
          <ButtonGroup>
            {!this.localOnly &&
              <Button
                onClick={() => this.setState({ tab: 'shared' })}
                buttonStyle={tab === 'shared' ? 'primary' : 'default'}
                id="clickable-nav-shared"
              >
                <FormattedMessage id="ui-directory.information.tab.shared" />
              </Button>
            }
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
          <>
            <Row>
              <Col xs={12} lgOffset={1} lg={10}>
                <MessageBanner>
                  <FormattedMessage id="ui-directory.information.heading.display-text" values={{ directory_entry: name }} />
                </MessageBanner>
              </Col>
            </Row>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={sectionsShared}
                    onToggle={this.handleAllSectionsToggleShared}
                  />
                </Col>
              </Row>
              <DirectoryEntryFormInfo id="directoryEntryFormInfo" open={sectionsShared.directoryEntryFormInfo} {...sectionProps} />
              <DirectoryEntryFormContactInfo id="directoryEntryFormContactInfo" open={sectionsShared.directoryEntryFormContactInfo} {...sectionProps} />
              <DirectoryEntryFormServices id="directoryEntryFormServices" open={sectionsShared.directoryEntryFormServices} {...sectionProps} />
              <DirectoryEntryFormCustProps id="directoryEntryFormCustProps" open={sectionsShared.directoryEntryFormCustProps} {...sectionProps} />
            </AccordionSet>
          </>
        }
        {tab === 'local' &&
          <>
            <Row>
              <Col xs={12} lgOffset={1} lg={10}>
                <MessageBanner>
                  <FormattedMessage id="ui-directory.information.local.heading.display-text" />
                </MessageBanner>
              </Col>
            </Row>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={sectionsLocal}
                    onToggle={this.handleAllSectionsToggleLocal}
                  />
                </Col>
              </Row>
              <LocalDirectoryEntryFormInfo id="localDirectoryEntryFormInfo" open={sectionsLocal.localDirectoryEntryFormInfo} {...sectionProps} />
            </AccordionSet>
          </>
        }
      </div>
    );
  }
}

export default DirectoryEntryForm;
