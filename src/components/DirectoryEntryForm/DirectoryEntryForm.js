import React, { useState } from 'react';
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

const DirectoryEntryForm = ({
  form,
  initialValues,
  parentResources,
  resources,
  stripes,
}) => {
  const layer = resources?.query?.layer ?? parentResources?.query?.layer;
  const managed = initialValues?.status?.value === 'managed' ||
    layer === 'create' ||
    layer === 'unit';

  const localOnly = (stripes.hasPerm('ui-directory.edit-local') &&
                    !stripes.hasPerm('ui-directory.edit-all') &&
                    !(managed && stripes.hasPerm('ui-directory.edit-self')));


  const [sectionsShared, setSectionsShared] = useState({
    directoryEntryFormInfo: true,
    directoryEntryFormContactInfo: true,
    directoryEntryFormServices: false,
    directoryEntryFormCustProps: false,
  });

  const [sectionsLocal, setSectionsLocal] = useState({
    localDirectoryEntryFormInfo: localOnly,
  });

  const [tab, setTab] = useState(localOnly ? 'local' : 'shared');


  const handleSectionToggle = ({ id }) => {
    if (Object.prototype.hasOwnProperty.call(sectionsShared, id)) {
      const sections = { ...sectionsShared };
      sections[id] = !sectionsShared[id];
      setSectionsShared(sections);
    }

    if (Object.prototype.hasOwnProperty.call(sectionsLocal, id)) {
      const sections = { ...sectionsLocal };
      sections[id] = !sectionsLocal[id];
      setSectionsLocal(sections);
    }
  };

  const handleAllSectionsToggleShared = (sections) => {
    setSectionsShared(sections);
  };

  const handleAllSectionsToggleLocal = (sections) => {
    setSectionsLocal(sections);
  };

  const sectionProps = {
    form,
    onToggle: handleSectionToggle,
    parentResources,
  };

  const name = resources?.selectedRecord?.records?.[0]?.fullyQualifiedName ??
    'this institution';
  return (
    <div>
      <Layout className="textCentered">
        <ButtonGroup>
          {!localOnly &&
            <Button
              onClick={() => setTab('shared')}
              buttonStyle={tab === 'shared' ? 'primary' : 'default'}
              id="clickable-nav-shared"
            >
              <FormattedMessage id="ui-directory.information.tab.shared" />
            </Button>
          }
          <Button
            onClick={() => setTab('local')}
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
                  onToggle={handleAllSectionsToggleShared}
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
                  onToggle={handleAllSectionsToggleLocal}
                />
              </Col>
            </Row>
            <LocalDirectoryEntryFormInfo id="localDirectoryEntryFormInfo" open={sectionsLocal.localDirectoryEntryFormInfo} {...sectionProps} />
          </AccordionSet>
        </>
      }
    </div>
  );
};

DirectoryEntryForm.propTypes = {
  form: PropTypes.object,
  parentResources: PropTypes.object,
  resources: PropTypes.shape({
    selectedRecord: PropTypes.shape({
      records: PropTypes.array,
    }),
  }),
  values: PropTypes.object,
};

export default DirectoryEntryForm;
