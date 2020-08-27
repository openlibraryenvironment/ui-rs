import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, AccordionSet } from '@folio/stripes/components';
import { actionsForRequest } from '../components/Flow/actionsByState';
import { ActionAccordion, RequestInfo } from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
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
  return (
    <AccordionSet>
      <Layout className="centered" style={{ maxWidth: '80%' }}>
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
