import React from 'react';
import PropTypes from 'prop-types';
import { AccordionSet } from '@folio/stripes/components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';
import { actionsForRequest } from '../components/Flow/actionsByState';
import renderNamedWithProps from '../util/renderNamedWithProps';
import * as flowViewComponents from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const { data: autoRespondRequest = {}, isSuccess: autoRespondLoaded } = useOkapiQuery('rs/settings/appSettings', {
    searchParams: {
      filters: 'section==autoResponder',
      perPage: '100',
      staleTime: 2 * 60 * 60 * 1000
    }
  });

  if (!autoRespondLoaded) return null;
  const autoLoanDisabled = autoRespondRequest.some(item => item.value && (item.value === 'off'));
  const forCurrent = actionsForRequest(request, autoLoanDisabled);

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
