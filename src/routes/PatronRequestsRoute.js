import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { SearchAndSort } from '@folio/stripes/smart-components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';
import stateString from '../util/stateString';
import PrintAllPullSlips from '../components/PrintAllPullSlips';

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


class PatronRequestsRoute extends React.Component {
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
        tags: 'tags.value',
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

    tagsValues: {
      type: 'okapi',
      path: 'tags',
      params: {
        limit: '1000',
        query: 'cql.allRecords=1 sortby label',
      },
      records: 'tags',
    },
  });

  static propTypes = {
    appName: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        action: PropTypes.string,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.object,
    mutator: PropTypes.object,
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
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

  getActionMenu(route, location) {
    return (
      <Link to={`${route}/printslips${location.search}`}>
        <FormattedMessage id="ui-rs.printAllPullSlips">
          {ariaLabel => (
            <Button
              id="clickable-print-pull-slips"
              aria-label={ariaLabel}
              buttonStyle="dropdownItem"
            >
              <FormattedMessage id="ui-rs.printPullSlips" />
            </Button>
          )}
        </FormattedMessage>
      </Link>
    );
  }

  render() {
    if (this.props.match.params.action === 'printslips') {
      return <PrintAllPullSlips records={this.props.resources.patronrequests} />;
    }

    const { mutator, resources, appName, location } = this.props;
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

    // Once we have broken up our use of <SearchAndSort> into
    // <SearchAndSortQuery>, we can nove the pull-slips button into a
    // more elegant position. For now, we just shove it in the top.
    return (
      <React.Fragment>
        <SearchAndSort
          key="patronrequests"
          title={appName === 'request' ? 'Requests' : appName === 'supply' ? 'Supply' : ''}
          actionMenu={() => this.getActionMenu(tweakedPackageInfo.stripes.route, location)}
          objectName="patronrequest"
          packageInfo={tweakedPackageInfo}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          createRecordPath="requests/create"
          viewRecordPathById={id => `requests/view/${id}`}
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
            state: 180,
            serviceType: 120,
          }}
          resultsFormatter={{
            id: a => a.id.substring(0, 8),
            isRequester: a => (a.isRequester === true ? '✓' : a.isRequester === false ? '✗' : ''),
            state: a => stateString(a.state),
            serviceType: a => a.serviceType && a.serviceType.value,
            pickLocation: a => a.pickLocation && a.pickLocation.name,
          }}
        />
      </React.Fragment>
    );
  }
}


export default stripesConnect(PatronRequestsRoute);
