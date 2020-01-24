import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Headline, Layout } from '@folio/stripes/components';
import css from './FlowRoute.css';
import { useMessage } from '../components/MessageModalState';
import actionsByState from '../components/Flow/actionsByState';
import * as cards from '../components/Flow/cardsByRequest';
import * as primaryActions from '../components/Flow/primaryActions';
import * as moreActions from '../components/Flow/moreActions';
import * as modals from '../components/Flow/modals';

const renderNamedWithProps = (names, components, props) => names.map(
  name => (components[name] ? React.createElement(components[name], { key: name, ...props }) : null)
);

const FlowRoute = props => {
  const [, setMessage] = useMessage();

  const performAction = (action, payload, successMessage, errorMessage) => (
    props.mutator.action.POST({ action, actionParams: payload || {} })
      .then(() => setMessage(successMessage, 'success'))
      .catch(() => setMessage(errorMessage, 'error'))
  );

  const resource = props.resources.selectedRecord;
  if (!_.get(resource, 'hasLoaded')) return null;
  const request = _.get(resource, 'records[0]');
  const byCurrent = Object.assign({}, actionsByState.default, actionsByState[request.state.code] || {});
  let PrimaryAction;
  if (byCurrent) PrimaryAction = _.get(primaryActions, byCurrent.primaryAction);

  return (
    <React.Fragment>
      <Layout className="centered" style={{ maxWidth: '80em' }}>
        <div>
          <strong>Request status</strong>
          <Headline size="large" faded><FormattedMessage id={`ui-rs.states.${request.state.code}`} /></Headline>
        </div>
        <div className={css.cards}>
          {renderNamedWithProps(byCurrent.cards, cards, { request })}
        </div>
        <Layout className="padding-top-gutter">
          {PrimaryAction && <PrimaryAction request={request} performAction={performAction} /> }
        </Layout>
        {byCurrent.moreActions.length > 0 &&
          <Layout className={`padding-top-gutter ${css.optionList}`}>
            <strong>More options:</strong>
            {renderNamedWithProps(byCurrent.moreActions, moreActions, { request, performAction })}
          </Layout>
        }
        {/* Render modals that correspond to available actions */}
        {renderNamedWithProps([byCurrent.primaryAction, ...byCurrent.moreActions], modals, { request, performAction })}
      </Layout>
    </React.Fragment>
  );
};

FlowRoute.manifest = {
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
  },
  action: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}/performAction',
    fetch: false,
    clientGeneratePk: false,
  },
};

FlowRoute.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FlowRoute);
