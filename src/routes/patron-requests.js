import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewPatronRequest from '../components/patron-request/view-patron-request';
import EditPatronRequest from '../components/patron-request/edit-patron-request';
import packageInfo from '../../package';
import getSASParams from '../util/getSASParams';

const INITIAL_RESULT_COUNT = 100;

const filterConfig = [
];

export default class PatronRequests extends React.Component {
  static manifest = Object.freeze({
    patronrequests: {
      type: 'okapi',
      path: 'rs/patronrequests',
      params: getSASParams({
        searchKey: 'title',
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
    },
    selectedPatronRequest: {
      type: 'okapi',
      path: 'rs/patronrequests/${selectedPatronRequestId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedPatronRequestId: { initialValue: '' },
  });

  static propTypes = {
    resources: PropTypes.object,
    mutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { };
  }

  onClose() {
    this.toggleModal(false);
  }

  handleUpdate = (patronRequest) => {
    // console.log('handleUpdate %o', patronRequest);
    this.props.mutator.selectedPatronRequestId.replace(patronRequest.id);
    return this.props.mutator.selectedPatronRequest.PUT(patronRequest);
  }

  render() {
    const { mutator, resources } = this.props;
    const path = '/rs/requests';
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
          editRecordComponent={EditPatronRequest}
          viewRecordPerms="module.rs.enabled"
          newRecordPerms="module.rs.enabled"
          detailProps={{
            onUpdate: this.handleUpdate
          }}
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
    );
  }
}
