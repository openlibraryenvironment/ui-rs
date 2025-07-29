import React from 'react';
import PropTypes from 'prop-types';
import { AccordionSet } from '@folio/stripes/components';
import { useActionsForRequest } from '../components/Flow/actionsByState';
import renderNamedWithProps from '../util/renderNamedWithProps';
import * as flowViewComponents from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const forCurrent = useActionsForRequest(request);

  const sectionProps = {
    forCurrent,
    performAction,
    request,
  };

  if (forCurrent === null || !request) return null;

  return (
    <AccordionSet>
      {renderNamedWithProps(forCurrent.flowComponents, flowViewComponents, { ...sectionProps })}
    </AccordionSet>
  );
};

FlowRoute.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default FlowRoute;
