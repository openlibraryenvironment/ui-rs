import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import Flow from '../components/Flow/Flow';
import AppNameContext from '../AppNameContext';
import flows from '../flows';
import css from './FlowRoute.css';

const FlowRoute = props => {
  const appName = useContext(AppNameContext);
  const { flow, stateMap } = flows[appName];
  return (
    <div className={css.container}>
      <div className={css.flow}>
        {_.get(props.resources.viewRecord, 'hasLoaded') &&
          <Flow currentState={props.resources.viewRecord.records[0].state.id} flow={flow} stateMap={stateMap} />
        }
      </div>
      <div className={css.context}>
        Yet to be determined how we populate this.
      </div>
    </div>
  );
};

FlowRoute.manifest = {
  viewRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}', // eslint-disable-line no-template-curly-in-string
  },
};

FlowRoute.propTypes = {
  resources: PropTypes.object.isRequired
};

export default stripesConnect(FlowRoute);
