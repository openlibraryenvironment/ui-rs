import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { AccordionSet, Col, ExpandAllButton, Headline, Layout, Row } from '@folio/stripes/components';
import { actionsForRequest } from '../components/Flow/actionsByState';
import { ActionAccordion, RequestInfo } from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const stripes = useStripes();
  const defaultAccordionState = {
    info: true,
    actions: true
  };

  const forCurrent = actionsForRequest(request);
  const [sections, setSections] = useState(defaultAccordionState);

  const handleSectionToggle = ({ id }) => {
    setSections((prevSections) => ({
      sections: {
        ...prevSections,
        [id]: !prevSections[id],
      }
    }));
  };

  const handleAllSectionsToggle = (sct) => {
    setSections(sct);
  };

  const getSectionProps = (id) => {
    return {
      forCurrent,
      id,
      onToggle: handleSectionToggle,
      open: sections[id],
      performAction,
      request,
    };
  };

  const inventoryLink = (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${stripes.config.sharedIndexUI}/inventory/view/${request.id}`}
    >
      <FormattedMessage id="ui-rs.flow.info.viewInSharedIndex" />
    </a>
  );

  return (
    <AccordionSet>
      <Layout className="centered" style={{ maxWidth: '80%' }}>
        <Headline margin="none" size="large" tag="h2" weight="regular">
          <strong>{`${request.hrid || request.id}: `}</strong>
          {request.title}
        </Headline>
        {inventoryLink}
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={sections}
              id="clickable-expand-all"
              onToggle={handleAllSectionsToggle}
            />
          </Col>
        </Row>
        <RequestInfo {...getSectionProps('info')} />
        <ActionAccordion {...getSectionProps('actions')} />
      </Layout>
    </AccordionSet>
  );
};

FlowRoute.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default FlowRoute;
