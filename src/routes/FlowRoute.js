import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Headline, KeyValue, Layout, AccordionSet } from '@folio/stripes/components';
import renderNamedWithProps from '../util/renderNamedWithProps';
import { actionsForRequest } from '../components/Flow/actionsByState';
import * as cards from '../components/Flow/cardsByRequest';
import css from '../components/Flow/FlowViewComponents/Flow.css';
import { ActionAccordion } from '../components/Flow/FlowViewComponents';

const FlowRoute = ({ request, performAction }) => {
  const defaultAccordionState = {
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
      <Layout className="centered" style={{ maxWidth: '80em' }}>
        <KeyValue label={<FormattedMessage id="stripes-reshare.requestState" />}>
          <Headline size="large" faded><FormattedMessage id={`stripes-reshare.states.${request.state?.code}`} /></Headline>
        </KeyValue>
        <div className={css.cards}>
          {renderNamedWithProps(forCurrent.cards, cards, { request })}
        </div>
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
