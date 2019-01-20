import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Headline,
  Pane,
  Paneset
} from '@folio/stripes-components';
import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewPatronRequest from '../components/patron-request/view-patron-request';
import packageInfo from '../../package';


const INITIAL_RESULT_COUNT = 100;

const filterConfig = [
];


export default class PatronRequests extends React.Component {

  static manifest = Object.freeze({
    patronrequests: {
      type: 'okapi',
      path: 'rs/patronrequests',
      params: {
        stats:"true"
      },
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      query: {},
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    query: {},
  });

  static propTypes = {
    resources: PropTypes.object,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { };
  }

  onClose() {
    this.toggleModal(false);
  }

  render() {
    console.log("Render PatronRequests");
    const { mutator, resources } = this.props;
    const path = '/rs/patronrequests';

    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort 
	  key="patronrequests"
          objectName="patronrequest"
	  packageInfo={packageInfo}
	  filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
	  viewRecordComponent={ViewPatronRequest}
          viewRecordPerms="module.rs.enabled"
          newRecordPerms="module.rs.enabled"
          parentResources={{
            ...resources,
            records: resources.patronrequests,
          }}
          parentMutator={{
            ...mutator,
            records: mutator.patronrequests,
          }}
          showSingleResult
          visibleColumns={[
            'id',
            'title',
            'patronReference',
            'state',
            'serviceType',
          ]}
          columnMapping={{
            id: <FormattedMessage id="ui-rs.patronrequests.id" />,
            title: <FormattedMessage id="ui-rs.patronrequests.title" />,
            patronReference: <FormattedMessage id="ui-rs.patronrequests.patronReference" />,
            state: <FormattedMessage id="ui-rs.patronrequests.state" />,
            serviceType: <FormattedMessage id="ui-rs.patronrequests.serviceType" />,
          }}
          columnWidths={{
            id: 300,
            title: 200,
            patronReference: 120,
            state: 120,
            serviceType: 120,
          }}
          resultsFormatter={{
            state: a => a.state && a.state.value,
            serviceType: a => a.serviceType && a.serviceType.value,
          }}
        />
      </React.Fragment>
    )
  }
}
