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
} from './sections';

class DirectoryEntryForm extends React.Component {
  static propTypes = {
    // XXX I don't think we need either of these
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
  }

  state = {
    sections: {
      directoryEntryFormInfo: true,
    }
  }

  getSectionProps() {
    return {
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
      parentMutator: this.props.parentMutator,
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

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  render() {
    const sectionProps = this.getSectionProps();
    const { sections } = this.state;

    return (
      <div>
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={sections}
                onToggle={this.handleAllSectionsToggle}
              />
            </Col>
          </Row>
          <DirectoryEntryFormInfo id="directoryEntryFormInfo" open={sections.directoryEntryFormInfo} {...sectionProps} />
        </AccordionSet>
      </div>
    );
  }
}

export default DirectoryEntryForm;
