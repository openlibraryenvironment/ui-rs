import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';

import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const filterConfig = [
];


function queryModifiedForApp(resources, props) {
  const { appName } = props;
  const res = Object.assign({}, resources.query);
  if (appName === 'request') {
    res.filters = 'r.true';
  } else if (appName === 'supply') {
    res.filters = 'r.false';
  }

  return res;
}


export default class PatronRequests extends React.Component {
  static manifest = Object.freeze({
    patronrequests: {
      type: 'okapi',
      path: 'rs/patronrequests',
      params: getSASParams({
        searchKey: 'title',
        filterKeys: {
          'r': 'isRequester',
        },
        queryGetter: queryModifiedForApp,
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
    },
    selectedRecord: {
      type: 'okapi',
      path: 'rs/patronrequests/${selectedRecordId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedRecordId: { initialValue: '' },
  });

  static propTypes = {
    appName: PropTypes.string.isRequired,
    resources: PropTypes.object,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = {};
  }

  onClose() {
    this.toggleModal(false);
  }

  createPatronRequest = (record) => {
    this.props.mutator.patronrequests.POST(record).then(() => {
      this.props.mutator.query.update({ layer: null });
    });
  };

  handleUpdate = (record) => {
    this.props.mutator.selectedRecordId.replace(record.id);
    return this.props.mutator.selectedRecord.PUT(record);
  }

  render() {
    const { mutator, resources, appName, match: { path } } = this.props;
    const tweakedPackageInfo = Object.assign({}, packageInfo, {
      name: `@folio/${appName}`,
      stripes: Object.assign({}, packageInfo.stripes, {
        route: `/${appName}/requests`,
      }),
    });

    const visibleColumns = [
      'id',
      'dateCreated',
      'title',
      'patronReference',
      'state',
      'serviceType',
    ];

    switch (appName) {
      case 'rs':
        visibleColumns.splice(1, 0, 'isRequester');
        break;
      case 'supply':
        visibleColumns.push('requestingInstitutionSymbol', 'localCallNumber', 'pickLocation', 'pickShelvingLocation');
        break;
      default:
        // can't happen
    }

    return (
      <React.Fragment>
        <SearchAndSort
          key="patronrequests"
          title={appName === 'request' ? 'Requests' : appName === 'supply' ? 'Supply' : ''}
          objectName="patronrequest"
          packageInfo={tweakedPackageInfo}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          createRecordPath={`${path}/requests/create`}
          viewRecordPathById={id => `${path}/view/${id}`}
          viewRecordPerms="module.rs.enabled"
          newRecordPerms="module.rs.enabled"
          onCreate={this.createPatronRequest}
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
          visibleColumns={visibleColumns}
          columnMapping={{
            id: <FormattedMessage id="ui-rs.patronrequests.id" />,
            isRequester: <FormattedMessage id="ui-rs.patronrequests.isRequester" />,
            dateCreated: <FormattedMessage id="ui-rs.patronrequests.dateCreated" />,
            title: <FormattedMessage id="ui-rs.patronrequests.title" />,
            patronReference: <FormattedMessage id="ui-rs.patronrequests.patronReference" />,
            state: <FormattedMessage id="ui-rs.patronrequests.state" />,
            serviceType: <FormattedMessage id="ui-rs.patronrequests.serviceType" />,
            pickLocation: <FormattedMessage id="ui-rs.patronrequests.pickLocation" />,
            localCallNumber: <FormattedMessage id="ui-rs.patronrequests.localCallNumber" />,
            pickShelvingLocation: <FormattedMessage id="ui-rs.patronrequests.pickShelvingLocation" />,
          }}
          columnWidths={{
            id: 80,
            isRequester: 80,
            dateCreated: 140,
            title: 200,
            patronReference: 120,
            state: 120,
            serviceType: 120,
          }}
          resultsFormatter={{
            id: a => a.id.substring(0, 8),
            isRequester: a => (a.isRequester === true ? '✓' : a.isRequester === false ? '✗' : ''),
            state: a => a.state && a.state.code,
            serviceType: a => a.serviceType && a.serviceType.value,
            pickLocation: a => a.pickLocation && a.pickLocation.name,
          }}
        />
      </React.Fragment>
    );
  }
}
