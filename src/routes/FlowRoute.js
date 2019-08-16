import React, { useContext } from 'react';
import _ from 'lodash';
import { Pane, Paneset } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import Flow from '../components/Flow/Flow';
import AppNameContext from '../AppNameContext';
import flows from '../flows';

const FlowRoute = props => {
  const appName = useContext(AppNameContext);
  const { flow, stateMap } = flows[appName];
  return (
    <Paneset>
      <Pane defaultWidth="320px">
        {_.get(props.resources.viewRecord, 'hasLoaded') &&
          <Flow currentState={props.resources.viewRecord.records[0].state.id} flow={flow} stateMap={stateMap} />
        }
      </Pane>
      <Pane defaultWidth="fill">
        Yet to be determined how we populate this.
      </Pane>
    </Paneset>
  );
};

FlowRoute.manifest = {
  viewRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}', // eslint-disable-line no-template-curly-in-string
  },
};

export default stripesConnect(FlowRoute);
