import React from 'react';
import PropTypes from 'prop-types';
import { AccordionSet } from '@folio/stripes/components';
import { actionsForRequest } from '../components/Flow/actionsByState';
import renderNamedWithProps from '../util/renderNamedWithProps';
import * as flowViewComponents from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {

  const forCurrent = actionsForRequest(request);

  const sectionProps = {
    forCurrent,
    performAction,
    request,
  };

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
