import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Headline } from '@folio/stripes/components';
import css from './FlowRoute.css';
import { useActionMessage } from '../components/Flow/ActionMessage';
import actionsByState from '../components/Flow/actionsByState';
import * as cards from '../components/Flow/cardsByRequest';
import * as primaryActions from '../components/Flow/primaryActions';
import * as moreActions from '../components/Flow/moreActions';

const renderNamedWithProps = (names, components, props) => names.map(
  name => React.createElement(components[name], { key: name, ...props })
);

const FlowRoute = props => {
  const [, setMessage] = useActionMessage();

  const performAction = (action, payload, successMessage, errorMessage) => {
    props.mutator.action.POST({ action, actionParams: payload || {} })
      .then(() => setMessage(successMessage, 'success'))
      .catch(() => setMessage(errorMessage, 'error'));
  };

  const resource = props.resources.selectedRecord;
  if (!_.get(resource, 'hasLoaded')) return null;
  const request = _.get(resource, 'records[0]');
  const byCurrent = actionsByState[request.state.code];
  let PrimaryAction;
  if (byCurrent) PrimaryAction = _.get(primaryActions, byCurrent.primaryAction);

  return (
    <div className={css.container}>
      <div className={css.flow}>
        <strong>Request status</strong>
        <Headline size="large" faded>{request.state.code}</Headline>
      </div>
      {byCurrent &&
        <div className={css.context}>
          {renderNamedWithProps(byCurrent.cards, cards, { request })}
          <p>
            {PrimaryAction && <PrimaryAction request={request} performAction={performAction} /> }
          </p>
          <p>
            <strong>More options:</strong>
            {renderNamedWithProps(byCurrent.moreActions, moreActions, { request, performAction })}
          </p>
        </div>
      }
      {!byCurrent &&
        <div className={css.context}>
          No content for this state.
        </div>
      }
    </div>
  );
};

FlowRoute.manifest = {
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}', // eslint-disable-line no-template-curly-in-string,
  },
  action: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}/performAction', // eslint-disable-line no-template-curly-in-string,
    fetch: false,
    clientGeneratePk: false,
  },
};

FlowRoute.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FlowRoute);
