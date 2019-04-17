import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row
} from '@folio/stripes/components';

/*
import {
  DirEntryFormInfo,
} from './sections';
*/

function DirEntryFormInfo() { return <p>form info</p>; }

class DirEntryForm extends React.Component {
  static propTypes = {
    // XXX I don't think we need either of these
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
  }

  state = {
    sections: {
      dirEntryFormInfo: true,
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
          <DirEntryFormInfo id="dirEntryFormInfo" open={sections.dirEntryFormInfo} {...sectionProps} />
        </AccordionSet>
      </div>
    );
  }
}

export default DirEntryForm;
