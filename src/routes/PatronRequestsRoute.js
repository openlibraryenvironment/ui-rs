import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import compose from 'compose-function';
import { Button, Accordion, FilterAccordionHeader, Datepicker } from '@folio/stripes/components';
import { SearchAndSort, withTags, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { generateQueryParams } from '@folio/stripes-erm-components';
import PrintAllPullSlips from '../components/PrintAllPullSlips';
import formattedDateTime from '../util/formattedDateTime';
import { parseFilters, deparseFilters } from '../util/parseFilters';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;


const appDetails = {
  rs: {
    title: 'Resource Sharing',
    visibleColumns: [
      'id',
      'isRequester',
      'dateCreated', 'title', 'patronIdentifier', 'state', 'serviceType',
    ],
  },
  request: {
    title: 'Requests',
    visibleColumns: [
      'id',
      'dateCreated', 'title', 'patronIdentifier', 'state', 'serviceType',
      'supplyingInstitutionSymbol',
    ],
    extraFilter: 'r.true',
    intlId: 'supplier',
    institutionFilterId: 'supplier',
    statePrefix: 'REQ',
  },
  supply: {
    title: 'Supply',
    visibleColumns: [
      'id',
      'dateCreated', 'title', 'patronIdentifier', 'state', 'serviceType',
      'requestingInstitutionSymbol', 'localCallNumber', 'pickLocation', 'pickShelvingLocation',
    ],
    extraFilter: 'r.false',
    intlId: 'requester',
    institutionFilterId: 'requester',
    statePrefix: 'RES',
  },
};


function queryModifiedForApp(resources, props) {
  const { appName } = props;
  const res = Object.assign({}, resources.query);
  const { extraFilter } = appDetails[appName];
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
      params: generateQueryParams({
        searchKey: 'id,hrid,patronGivenName,patronSurname,title,author,issn,isbn',
        filterKeys: {
          'r': 'isRequester',
          'state': 'state.code',
          'requester': 'resolvedRequester.owner.id',
          'supplier': 'resolvedSupplier.owner.id',
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
    institutions: {
      type: 'okapi',
      path: 'directory/entry',
      params: {
        filters: 'tags.value==INSTITUTION',
        perPage: '100',
        stats: 'true',
      },
    },
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

  // The use of `key=...` in the <Datepicker>s below forces a
  // reinstantiation rather than a mere re-render, which works around
  // a bug in Datepicker where the `value` prop is ignored except on
  // the first render.
  //
  // Including these `key` properties causes a benign console error:
  //    Warning: Can't perform a React state update on an unmounted component
  // I hope we can make this go away just by removing the `key`
  // properties once the Datepicker rendering bug has been fixed.
  //
  renderFiltersFromData = (options) => {
    const { appName, resources, mutator } = this.props;
    const { intlId, institutionFilterId } = appDetails[appName];
    const byName = parseFilters(get(resources.query, 'filters'));
    const values = {
      state: byName.state || [],
      institution: byName[institutionFilterId] || [],
    };

    const setFilterState = (group) => {
      if (group.values === null) {
        delete byName[group.name];
      } else {
        byName[group.name] = group.values;
      }
      mutator.query.update({ filters: deparseFilters(byName) });
    };
    const clearGroup = (name) => setFilterState({ name, values: [] });
    const setFilterDate = (name, relation, value) => {
      const preposition = relation === '>=' ? 'From' : 'To';
      setFilterState({ name: `${name}${preposition}`, values: value ? [`${name}${relation}${value}`] : null });
    };
    const clearDate = (name) => {
      setFilterDate(name, '>=', null);
      setFilterDate(name, '<=', null);
    };

    const dateCreatedFrom = get(byName.dateCreatedFrom, 0, '');
    const dateCreatedTo = get(byName.dateCreatedTo, 0, '');
    const neededByFrom = get(byName.neededByFrom, 0, '');
    const neededByTo = get(byName.neededByTo, 0, '');

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.state" />}
          id="state"
          name="state"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={values.state.length > 0}
          onClearFilter={() => clearGroup('state')}
        >
          <MultiSelectionFilter
            name="state"
            dataOptions={options.state}
            selectedValues={values.state}
            onChange={setFilterState}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id={`ui-rs.filter.${intlId}`} />}
          id="institution"
          name="institution"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={values.institution.length > 0}
          onClearFilter={() => clearGroup('institution')}
        >
          <MultiSelectionFilter
            name={institutionFilterId}
            dataOptions={options.institution}
            selectedValues={values.institution}
            onChange={setFilterState}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.dateSubmitted" />}
          id="dateCreated"
          name="dateCreated"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={byName.dateCreatedFrom !== undefined || byName.dateCreatedTo !== undefined}
          onClearFilter={() => clearDate('dateCreated')}
        >
          <Datepicker
            name="dateCreatedFrom"
            label="From"
            dateFormat="YYYY-MM-DD"
            value={dateCreatedFrom}
            key={`cf${dateCreatedFrom}`}
            onChange={(e) => setFilterDate('dateCreated', '>=', e.target.value)}
          />
          <Datepicker
            name="dateCreatedTo"
            label="To"
            dateFormat="YYYY-MM-DD"
            value={dateCreatedTo}
            key={`ct${dateCreatedTo}`}
            onChange={(e) => setFilterDate('dateCreated', '<=', e.target.value)}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.dateNeeded" />}
          id="neededBy"
          name="neededBy"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={byName.neededByFrom !== undefined || byName.neededByTo !== undefined}
          onClearFilter={() => clearDate('neededBy')}
        >
          <Datepicker
            name="neededByFrom"
            label="From"
            dateFormat="YYYY-MM-DD"
            value={neededByFrom}
            key={`nf${neededByFrom}`}
            onChange={(e) => setFilterDate('neededBy', '>=', e.target.value)}
          />
          <Datepicker
            name="neededByTo"
            label="To"
            dateFormat="YYYY-MM-DD"
            value={neededByTo}
            key={`nt${neededByTo}`}
            onChange={(e) => setFilterDate('neededBy', '<=', e.target.value)}
          />
        </Accordion>
      </React.Fragment>
    );
  }

  renderFilters = () => {
    const { appName, intl, resources } = this.props;
    const compareLabel = (a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);

    const { statePrefix } = appDetails[appName];
    const keys = filter(Object.keys(intl.messages),
      key => key.startsWith(`stripes-reshare.states.${statePrefix}_`));
    const states = keys.map(key => ({ label: intl.messages[key], value: key.replace('stripes-reshare.states.', '') }))
      .sort(compareLabel);

    const records = get(resources, 'institutions.records');
    const institutions = (records && records[0] ? records[0].results : [])
      .map(x => ({ label: x.name, value: x.id }))
      .sort(compareLabel);

    return this.renderFiltersFromData({
      state: states,
      institution: institutions,
    });
  };

  render() {
    if (this.props.match.params.action === 'printslips') {
      return <PrintAllPullSlips records={this.props.resources.patronrequests} />;
    }

    const { mutator, resources, appName, location, intl } = this.props;
    const { title, visibleColumns } = appDetails[appName];
    const tweakedPackageInfo = Object.assign({}, packageInfo, {
      name: `@folio/${appName}`,
      stripes: Object.assign({}, packageInfo.stripes, {
        route: `/${appName}/requests`,
      }),
    });

    const searchableIndexes = [
      { label: 'allFields', value: '' },
      { label: 'id', value: 'id' },
      { label: 'hrid', value: 'hrid' },
      { label: 'requesterGivenName', value: 'patronGivenName' },
      { label: 'requesterSurname', value: 'patronSurname' },
      { label: 'title', value: 'title' },
      { label: 'author', value: 'author' },
      { label: 'issn', value: 'issn' },
      { label: 'isbn', value: 'isbn' },
    ].map(x => ({
      label: intl.formatMessage({ id: `ui-rs.index.${x.label}` }),
      value: x.value,
    }));
    if (appName === 'supply') searchableIndexes.splice(3, 2);

    return (
      <React.Fragment>
        <SearchAndSort
          key="patronrequests"
          title={title}
          actionMenu={() => this.getActionMenu(tweakedPackageInfo.stripes.route, location)}
          searchableIndexes={searchableIndexes}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.onChangeIndex}
          objectName="patronrequest"
          packageInfo={tweakedPackageInfo}
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
            supplyingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.supplyingInstitutionSymbol" />,
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
            supplyingInstitutionSymbol: 130,
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
            supplyingInstitutionSymbol: a => get(a, 'resolvedSupplier.owner.symbolSummary', '').replace(/,.*/, ''),
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
