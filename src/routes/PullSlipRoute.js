import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import PrintPullSlip from '../components/PrintPullSlip';

const PullSlipRoute = props => {
  return (
    <div>
      <div>
        {
          get(props.resources.viewRecord, 'hasLoaded') &&
            <PrintPullSlip record={props.resources.viewRecord.records[0]} />
        }
      </div>
    </div>
  );
};

PullSlipRoute.manifest = {
  viewRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
  },
};

PullSlipRoute.propTypes = {
  resources: PropTypes.shape({
    viewRecord: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ).isRequired,
    }),
  }).isRequired
};

export default stripesConnect(PullSlipRoute);
