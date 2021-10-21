import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import compose from 'compose-function';
import { Badge, Button, Accordion, FilterAccordionHeader, Datepicker } from '@folio/stripes/components';
import { SearchAndSort, withTags, CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { generateQueryParams } from '@folio/stripes-erm-components';
import PrintAllPullSlips from '../components/PrintAllPullSlips';
import { parseFilters, deparseFilters } from '../util/parseFilters';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const everythingAfterEquals = s => s.slice(s.indexOf('=') + 1);

const appDetails = {
  rs: {
    title: 'Resource Sharing',
    visibleColumns: [
      'id',
      'isRequester',
      'dateCreated', 'patronIdentifier', 'state', 'serviceType',
      'title',
    ],
    createPerm: 'rs.patronrequests.item.post',
  },
  request: {
    title: 'Requests',
    visibleColumns: [
      'flags', 'id',
      'dateCreated', 'selectedItemBarcode', 'patronIdentifier', 'state', 'serviceType',
      'supplyingInstitutionSymbol',
      'title',
    ],
    extraFilter: 'r.true',
    intlId: 'supplier',
    institutionFilterId: 'supplier',
    statePrefix: 'REQ',
    createPerm: 'ui-request.create',
  },
  supply: {
    title: 'Supply',
    visibleColumns: [
      'flags', 'id',
      'dateCreated', 'state', 'serviceType',
      'requestingInstitutionSymbol', 'selectedItemBarcode', 'pickLocation',
      'title',
    ],
    extraFilter: 'r.false',
    intlId: 'requester',
    institutionFilterId: 'requester',
    statePrefix: 'RES',
    createPerm: 'ui-supply.create',
  },
};

const removeMalformedDates = (filterString) => {
  return filterString && filterString
    .split(',')
    .filter(kv => {
      return (!kv.startsWith('date') ||
              kv.match(/[<>=]\d{4}-\d{2}-\d{2}/));
    })
    .join(',');
};

function queryModifiedForApp(resources, props) {
  const { appName } = props;
  const res = { ...resources.query };
  res.filters = removeMalformedDates(res.filters);
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

function compareLabel(a, b) {
  return (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);
}

class PatronRequestsRoute extends React.Component {
  static manifest = Object.freeze({
    patronrequests: {
      type: 'okapi',
      path: 'rs/patronrequests',
      params: generateQueryParams({
        searchKey: 'id,hrid,patronGivenName,patronSurname,title,author,issn,isbn,volumes.itemId',
        // Omitting the date and unread filter keys here causes it to include their value verbatim
        // rather than adding the key name and operator. This way we can store the operator and field
        // in the value eg. how the hasUnread checkbox sets a value of 'unreadMessageCount>0'.
        filterKeys: {
          'r': 'isRequester',
          'needsAttention': 'state.needsAttention',
          'state': 'state.code',
          'location': 'pickLocation.id',
          'requester': 'resolvedRequester.owner.id',
          'supplier': 'resolvedSupplier.owner.id',
          'terminal': 'state.terminal'
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
        filters: 'type.value=institution',
        perPage: '100',
        stats: 'true',
      },
    },
    lmsLocations: {
      type: 'okapi',
      path: 'rs/hostLMSLocations',
      params: {
        perPage: '100',
      }
    },
    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    // initialFilters prop doesn't work, store default filters here
    query: { },

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
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = {};

    const { appName, intl } = props;
    const { statePrefix } = appDetails[appName];
    const keys = Object.keys(intl.messages).filter(
      key => key.startsWith(`stripes-reshare.states.${statePrefix}_`)
    );
    this.states = keys.map(key => ({ label: intl.messages[key], value: key.replace('stripes-reshare.states.', '') }))
      .sort(compareLabel);
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
      location: byName.location || [],
      needsAttention: byName.needsAttention || [],
      hasUnread: byName.hasUnread || [],
      terminal: byName.terminal || []
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

    // Parse the dates out of the filter parameters to populate the form fields
    const dateNames = ['dateCreatedFrom', 'dateCreatedTo', 'neededByFrom', 'neededByTo'];
    const dates = dateNames.reduce((acc, name) => {
      acc[name] = everythingAfterEquals(get(byName[name], 0, ''));
      return acc;
    }, {});

    return (
      <>
        <CheckboxFilter
          name="needsAttention"
          dataOptions={options.needsAttention}
          selectedValues={values.needsAttention}
          onChange={setFilterState}
        />
        <CheckboxFilter
          name="hasUnread"
          dataOptions={options.hasUnread}
          selectedValues={values.hasUnread}
          onChange={setFilterState}
        />
        <CheckboxFilter
          name="terminal"
          dataOptions={options.terminal}
          selectedValues={values.terminal}
          onChange={setFilterState}
        />
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.state" />}
          id="state"
          name="state"
          separator={false}
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
        {appName === 'supply' &&
          <Accordion
            label={<FormattedMessage id="ui-rs.patronrequests.pickLocation" />}
            id="location"
            name="location"
            separator={false}
            header={FilterAccordionHeader}
            displayClearButton={values.location.length > 0}
            onClearFilter={() => clearGroup('location')}
          >
            <MultiSelectionFilter
              name="location"
              dataOptions={options.location}
              selectedValues={values.location}
              onChange={setFilterState}
            />
          </Accordion>
        }
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.dateSubmitted" />}
          id="dateCreated"
          name="dateCreated"
          separator={false}
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={byName.dateCreatedFrom !== undefined || byName.dateCreatedTo !== undefined}
          onClearFilter={() => clearDate('dateCreated')}
        >
          <Datepicker
            name="dateCreatedFrom"
            label="From"
            dateFormat="YYYY-MM-DD"
            value={dates.dateCreatedFrom}
            key={`cf${dates.dateCreatedFrom}`}
            onChange={(e) => setFilterDate('dateCreated', '>=', e.target.value)}
          />
          <Datepicker
            name="dateCreatedTo"
            label="To"
            dateFormat="YYYY-MM-DD"
            value={dates.dateCreatedTo}
            key={`ct${dates.dateCreatedTo}`}
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
            value={dates.neededByFrom}
            key={`nf${dates.neededByFrom}`}
            onChange={(e) => setFilterDate('neededBy', '>=', e.target.value)}
          />
          <Datepicker
            name="neededByTo"
            label="To"
            dateFormat="YYYY-MM-DD"
            value={dates.neededByTo}
            key={`nt${dates.neededByTo}`}
            onChange={(e) => setFilterDate('neededBy', '<=', e.target.value)}
          />
        </Accordion>
      </>
    );
  }

  renderFilters = () => {
    const { intl, resources } = this.props;

    const records = get(resources, 'institutions.records');
    const institutions = (records && records[0] ? records[0].results : [])
      .map(x => ({ label: x.name, value: x.id }))
      .sort(compareLabel);

    const location = (resources?.lmsLocations?.records ?? [])
      .map(x => ({ label: x.name, value: x.id }))
      .sort(compareLabel);

    const needsAttention = [({ label: intl.formatMessage({ id: 'ui-rs.needsAttention' }), value: 'true' })];
    // see comment in manifest for explanation of value
    const hasUnread = [({ label: intl.formatMessage({ id: 'ui-rs.unread' }), value: 'unreadMessageCount>0' })];
    const terminal = [({ label: intl.formatMessage({ id: 'ui-rs.hideComplete' }), value: 'false' })];

    return this.renderFiltersFromData({
      state: this.states,
      institution: institutions,
      location,
      needsAttention,
      hasUnread,
      terminal
    });
  };

  render() {
    if (this.props.match.params.action === 'printslips') {
      return <PrintAllPullSlips records={this.props.resources.patronrequests} />;
    }

    const { mutator, resources, appName, location, intl } = this.props;
    const { title, visibleColumns, createPerm } = appDetails[appName];
    const tweakedPackageInfo = { ...packageInfo,
      name: `@folio/${appName}`,
      stripes: { ...packageInfo.stripes, route: `/${appName}/requests` } };

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
      { label: 'itemBarcode', value: 'volumes.itemId' },
    ].map(x => ({
      label: intl.formatMessage({ id: `ui-rs.index.${x.label}` }),
      value: x.value,
    }));
    if (appName === 'supply') searchableIndexes.splice(3, 2);

    return (
      <>
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
          initialFilters="terminal.false"
          resultCountIncrement={INITIAL_RESULT_COUNT}
          createRecordPath={`requests/create${location.search}`}
          viewRecordPathById={id => `requests/view/${id}${location.search}`}
          viewRecordPerms="module.rs.enabled"
          newRecordPerms={createPerm}
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
          visibleColumns={visibleColumns}
          columnMapping={{
            flags: '',
            id: <FormattedMessage id="ui-rs.patronrequests.id" />,
            isRequester: <FormattedMessage id="ui-rs.patronrequests.isRequester" />,
            dateCreated: <FormattedMessage id="ui-rs.patronrequests.dateCreated" />,
            title: <FormattedMessage id="ui-rs.patronrequests.title" />,
            patronIdentifier: <FormattedMessage id="ui-rs.patronrequests.patronIdentifier" />,
            state: <FormattedMessage id="ui-rs.patronrequests.state" />,
            serviceType: <FormattedMessage id="ui-rs.patronrequests.serviceType" />,
            requestingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.requestingInstitutionSymbol" />,
            supplyingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.supplyingInstitutionSymbol" />,
            selectedItemBarcode: <FormattedMessage id="ui-rs.patronrequests.selectedItemBarcode" />,
            pickLocation: <FormattedMessage id="ui-rs.patronrequests.pickLocation" />,
          }}
          columnWidths={{
            flags: '48px',
            id: { max: 115 },
            dateCreated: '96px',
            state: { min: 84 },
            serviceType: { max: 80 },
            selectedItemBarcode: '130px',
          }}
          resultsFormatter={{
            id: a => a.hrid,
            flags: a => {
              const needsAttention = a?.state?.needsAttention;
              if (a?.unreadMessageCount > 0) {
                if (needsAttention) {
                  return (
                    <Badge
                      color="red"
                      aria-label={intl.formatMessage({ id: 'ui-rs.needsAttention' }) + intl.formatMessage({ id: 'ui-rs.unread' })}
                    >
                      {`${a.unreadMessageCount}!`}
                    </Badge>
                  );
                }
                return <Badge color="primary" aria-label={intl.formatMessage({ id: 'ui-rs.unread' })}>{a.unreadMessageCount}</Badge>;
              } else if (needsAttention) return <Badge color="red" aria-label={intl.formatMessage({ id: 'ui-rs.needsAttention' })}>!</Badge>;
              return '';
            },
            isRequester: a => (a.isRequester === true ? '✓' : a.isRequester === false ? '✗' : ''),
            dateCreated: a => (new Date(a.dateCreated).toLocaleDateString() === new Date().toLocaleDateString()
              ? <FormattedTime value={a.dateCreated} />
              : <FormattedDate value={a.dateCreated} />),
            patronIdentifier: a => {
              const { patronGivenName, patronSurname } = a;
              if (patronGivenName && patronSurname) return `${patronSurname}, ${patronGivenName}`;
              if (patronSurname) return patronSurname;
              if (patronGivenName) return patronGivenName;
              return a.patronIdentifier;
            },
            state: a => <FormattedMessage id={`stripes-reshare.states.${a.state?.code}`} />,
            serviceType: a => a.serviceType && a.serviceType.value,
            supplyingInstitutionSymbol: a => get(a, 'resolvedSupplier.owner.symbolSummary', '').replace(/,.*/, ''),
            pickLocation: a => a.pickLocation && a.pickLocation.name,
            selectedItemBarcode: a => (a.volumes?.length <= 1 ? a.volumes[0]?.itemId : <FormattedMessage id="ui-rs.flow.info.itemBarcode.multiVolRequest" />)
          }}
          renderFilters={this.renderFilters}
          hasNewButton={this.props.appName === 'request'}
        />
      </>
    );
  }
}

export default compose(
  injectIntl,
  stripesConnect,
  withTags,
)(PatronRequestsRoute);
