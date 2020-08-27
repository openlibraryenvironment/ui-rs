import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { AccordionSet, Headline, Layout } from '@folio/stripes/components';
import { actionsForRequest } from '../components/Flow/actionsByState';
import { ActionAccordion, RequestInfo } from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const stripes = useStripes();

  const forCurrent = actionsForRequest(request);

  const sectionProps = {
    forCurrent,
    performAction,
    request,
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
      <Headline margin="none" size="large" tag="h2" weight="regular">
        <strong>{`${request.hrid || request.id}: `}</strong>
        {request.title}
      </Headline>
      {inventoryLink}
      <RequestInfo {...sectionProps} />
      <ActionAccordion {...sectionProps} />
    </AccordionSet>
  );
};

FlowRoute.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default FlowRoute;
