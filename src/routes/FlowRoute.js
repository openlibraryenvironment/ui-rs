import React from 'react';
import PropTypes from 'prop-types';
import { AccordionSet } from '@folio/stripes/components';
import { useSetting } from '@projectreshare/stripes-reshare';
import { actionsForRequest } from '../components/Flow/actionsByState';
import renderNamedWithProps from '../util/renderNamedWithProps';
import * as flowViewComponents from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const autoResponderStatus = useSetting('auto_responder_status');
  if (!autoResponderStatus.isSuccess) return null;
  const autoLoanOff = autoResponderStatus.value === 'off';
  const forCurrent = actionsForRequest(request, autoLoanOff);

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
