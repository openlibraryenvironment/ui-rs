import React from 'react';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row
} from '@folio/stripes/components';

import {
  RequestMetadataForm,
  PatronRequestInfoForm,
} from './sections';

class PatronRequestForm extends React.Component {
  state = {
    sections: {
      requestMetadataForm: true,
      patronRequestInfoForm: true,
    }
  }

  getSectionProps() {
    return {
      onToggle: this.handleSectionToggle,
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
          <RequestMetadataForm id="requestMetadataForm" open={sections.requestMetadataForm} {...sectionProps} />
          <PatronRequestInfoForm id="patronRequestInfoForm" open={sections.patronRequestInfoForm} {...sectionProps} />
        </AccordionSet>
      </div>
    );
  }
}

export default PatronRequestForm;
