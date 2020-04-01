import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Headline, KeyValue, Layout } from '@folio/stripes/components';
import initialToUpper from '../util/initialToUpper';
import renderNamedWithProps from '../util/renderNamedWithProps';
import { actionsForRequest } from '../components/Flow/actionsByState';
import * as cards from '../components/Flow/cardsByRequest';
import * as primaryActions from '../components/Flow/primaryActions';
import * as moreActions from '../components/Flow/moreActions';
import css from './FlowRoute.css';

const FlowRoute = ({ request, performAction }) => {
  const forCurrent = actionsForRequest(request);
  let PrimaryAction;
  if (forCurrent.primaryAction) {
    PrimaryAction = _.get(primaryActions, initialToUpper(forCurrent.primaryAction))
      || primaryActions.Generic;
  }
  return (
    <React.Fragment>
      <Layout className="centered" style={{ maxWidth: '80em' }}>
        <KeyValue label={<FormattedMessage id="stripes-reshare.requestStatus" />}>
          <Headline size="large" faded><FormattedMessage id={`stripes-reshare.states.${request.state?.code}`} /></Headline>
        </KeyValue>
        <div className={css.cards}>
          {renderNamedWithProps(forCurrent.cards, cards, { request })}
        </div>
        <Layout className="padding-top-gutter">
          {PrimaryAction && <PrimaryAction request={request} name={forCurrent.primaryAction} performAction={performAction} /> }
        </Layout>
        {forCurrent.moreActions.length > 0 &&
          <Layout className={`padding-top-gutter ${css.optionList} ${css.noBorderRadius}`}>
            <strong>More options:</strong>
            {renderNamedWithProps(forCurrent.moreActions, moreActions, { request, performAction }, moreActions.Generic)}
          </Layout>
        }
      </Layout>
    </React.Fragment>
  );
};

FlowRoute.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default FlowRoute;
