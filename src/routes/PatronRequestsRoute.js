import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import compose from 'compose-function';
import { Button, Accordion, FilterAccordionHeader } from '@folio/stripes/components';
import { SearchAndSort, withTags, MultiSelectionFilter } from '@folio/stripes/smart-components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';
import PrintAllPullSlips from '../components/PrintAllPullSlips';
import formattedDateTime from '../util/formattedDateTime';

import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;


const filterConfig = [{
  label: 'Status',
  name: 'status',
  cql: 'status',
  values: [],
}];


// parseFilters parses a string like
//    departments.123,coursetypes.abc,coursetypes.def
// into an object mapping filter-name to lists of values;
// and deparseFilters performs the opposite operation

function parseFilters(filters) {
  if (!filters) return {};
  const byName = {};

  filters.split(',').forEach(string => {
    const [name, value] = string.split('.');
    if (!byName[name]) byName[name] = [];
    byName[name].push(value);
  });

  return byName;
}

function deparseFilters(byName) {
  const a = [];

  Object.keys(byName).sort().forEach(name => {
    const values = byName[name];
    values.forEach(value => {
      a.push(`${name}.${value}`);
    });
  });

  return a.join(',');
}


function queryModifiedForApp(resources, props) {
  const { appName } = props;
  const res = Object.assign({}, resources.query);
  const extraFilter = { request: 'r.true', supply: 'r.false' }[appName];
  if (extraFilter) {
    res.filters = !res.filters ? extraFilter : `${res.filters},${extraFilter}`;
  }

  // Special case: `refresh=1` can be added to the UI URL to force the
  // addition of a meaningless (and ignored) additional sort
  // criterion. This defeats stripes-connect's caching of the result
  // from (what would otherwise be) the same URL the last time this
  // resource was needed. We set this when returning from
  // PrintAllPullSlips so that status changes are reflected.
  if (res.refresh) {
    delete res.refresh;
    res.sort = `${res.sort},_refresh`;
  }

  return res;
}


class PatronRequestsRoute extends React.Component {
  static manifest = Object.freeze({
    patronrequests: {
      type: 'okapi',
      path: 'rs/patronrequests',
      params: getSASParams({
        searchKey: 'id,hrid,patronGivenName,patronSurname,title,author,issn,isbn',
        filterKeys: {
          'r': 'isRequester',
          's': 'state.code',
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
      path: 'rs/patronrequests/%{selectedRecordId}',
      fetch: false,
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedRecordId: { initialValue: '' }
  });

  static propTypes = {
    appName: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        action: PropTypes.string,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.string,
        filters: PropTypes.string,
      }),
      patronrequests: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
      patronrequests: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
      selectedRecordId: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }).isRequired,
      selectedRecord: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }),
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = {};
  }

  onClose() {
    this.toggleModal(false);
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.stripes.logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  };

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

  renderFilters = () => {
    const prefix = { request: 'REQ', supply: 'RES' }[this.props.appName];
    const messages = this.props.intl.messages;
    const keys = filter(Object.keys(messages),
      key => key.startsWith(`stripes-reshare.states.${prefix}_`));
    const statuses = keys.map(key => ({ label: messages[key], value: key.replace('stripes-reshare.states.', '') }))
      .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0));

    const byName = parseFilters(get(this.props.resources.query, 'filters'));
    const status = byName.s || [];

    const setFilterState = (group) => {
      byName[group.name] = group.values;
      this.props.mutator.query.update({ filters: deparseFilters(byName) });
    };
    const clearGroup = (name) => setFilterState({ name, values: [] });

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.status" />}
          id="status"
          name="status"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={status.length > 0}
          onClearFilter={() => clearGroup('status')}
        >
          <MultiSelectionFilter
            name="s"
            dataOptions={statuses}
            selectedValues={status}
            onChange={setFilterState}
          />
        </Accordion>
      </React.Fragment>
    );
  };

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
      'patronIdentifier',
      'state',
      'serviceType',
    ];

    const searchableIndexes = [
      { label: 'All fields', value: '' },
      { label: 'UUID', value: 'id' },
      { label: 'HRID', value: 'hrid' },
      { label: 'Requested first name', value: 'patronGivenName' },
      { label: 'Requester last name', value: 'patronSurname' },
      { label: 'Title', value: 'title' },
      { label: 'Author', value: 'author' },
      { label: 'ISSN', value: 'issn' },
      { label: 'ISBN', value: 'isbn' },
    ];

    switch (appName) {
      case 'rs':
        visibleColumns.splice(1, 0, 'isRequester');
        break;
      case 'supply':
        visibleColumns.push('requestingInstitutionSymbol', 'localCallNumber', 'pickLocation', 'pickShelvingLocation');
        searchableIndexes.splice(3, 2);
        break;
      default:
        // 'request' or can't-happen values
    }

    return (
      <React.Fragment>
        <SearchAndSort
          key="patronrequests"
          title={appName === 'request' ? 'Requests' : appName === 'supply' ? 'Supply' : ''}
          actionMenu={() => this.getActionMenu(tweakedPackageInfo.stripes.route, location)}
          searchableIndexes={searchableIndexes}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.onChangeIndex}
          objectName="patronrequest"
          packageInfo={tweakedPackageInfo}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          createRecordPath="requests/create"
          viewRecordPathById={id => `requests/view/${id}${location.search}`}
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
            patronIdentifier: <FormattedMessage id="ui-rs.patronrequests.patronIdentifier" />,
            state: <FormattedMessage id="ui-rs.patronrequests.state" />,
            serviceType: <FormattedMessage id="ui-rs.patronrequests.serviceType" />,
            requestingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.requestingInstitutionSymbol" />,
            localCallNumber: <FormattedMessage id="ui-rs.patronrequests.localCallNumber" />,
            pickLocation: <FormattedMessage id="ui-rs.patronrequests.pickLocation" />,
            pickShelvingLocation: <FormattedMessage id="ui-rs.patronrequests.pickShelvingLocation" />,
          }}
          columnWidths={{
            id: 110,
            isRequester: 80,
            dateCreated: 170,
            title: 200,
            patronIdentifier: 120,
            state: 180,
            serviceType: 130,
            requestingInstitutionSymbol: 130,
            localCallNumber: 200,
            pickLocation: 150,
            pickShelvingLocation: 200,

          }}
          resultsFormatter={{
            id: a => a.hrid,
            isRequester: a => (a.isRequester === true ? '✓' : a.isRequester === false ? '✗' : ''),
            dateCreated: a => formattedDateTime(a.dateCreated),
            patronIdentifier: a => {
              const { patronGivenName, patronSurname } = a;
              if (patronGivenName && patronSurname) return `${patronSurname}, ${patronGivenName}`;
              if (patronSurname) return patronSurname;
              if (patronGivenName) return patronGivenName;
              return a.patronIdentifier;
            },
            state: a => <FormattedMessage id={`stripes-reshare.states.${a.state.code}`} />,
            serviceType: a => a.serviceType && a.serviceType.value,
            pickLocation: a => a.pickLocation && a.pickLocation.name,
          }}
          renderFilters={this.renderFilters}
        />
      </React.Fragment>
    );
  }
}


export default compose(
  injectIntl,
  stripesConnect,
  withTags,
)(PatronRequestsRoute);
