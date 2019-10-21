import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row
} from '@folio/stripes/components';

import {
  DirectoryEntryFormInfo,
} from './sectionsShared';

class DirectoryEntryForm extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
  }

  state = {
    sectionsShared: {
      directoryEntryFormInfo: true,
    }
  }

  getSectionProps() {
    return {
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
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

  handleAllSectionsToggle = (sectionsShared) => {
    this.setState({ sectionsShared });
  }

  render() {
    const sectionProps = this.getSectionProps();
    const { sectionsShared } = this.state;

    return (
      <div>
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={sectionsShared}
                onToggle={this.handleAllSectionsToggle}
              />
            </Col>
          </Row>
          <DirectoryEntryFormInfo id="directoryEntryFormInfo" open={sectionsShared.directoryEntryFormInfo} {...sectionProps} />
        </AccordionSet>
      </div>
    );
  }
}

export default DirectoryEntryForm;
