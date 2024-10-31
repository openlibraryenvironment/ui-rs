import React, { useContext, useEffect, useState } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl
} from 'react-intl';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';
import { useQueryClient } from 'react-query';
import {
  Badge,
  Button,
  Icon,
  IconButton,
  Loading,
  LoadingPane,
  MCLPagingTypes,
  MultiColumnList,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, useOkapiKy, useStripes } from '@folio/stripes/core';
import { SearchAndSortQuery, PersistedPaneset } from '@folio/stripes/smart-components';
import { useIntlCallout } from '@projectreshare/stripes-reshare';
import AppNameContext from '../../AppNameContext';
import Filters from './Filters';
import Search from './Search';

const appDetails = {
  request: {
    title: 'Requests',
    visibleColumns: [
      'flags', 'hrid',
      'dateCreated', 'lastUpdated', 'selectedItemBarcode', 'patronIdentifier', 'state', 'serviceType',
      'supplyingInstitutionSymbol', 'pickupLocation',
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
      'flags', 'hrid',
      'dateCreated', 'lastUpdated', 'state', 'serviceType',
      'requestingInstitutionSymbol', 'selectedItemBarcode', 'pickLocation',
      'pickShelvingLocation', 'title'
    ],
    extraFilter: 'r.false',
    intlId: 'requester',
    institutionFilterId: 'requester',
    statePrefix: 'RES',
    createPerm: 'ui-supply.create',
  },
};

const PatronRequests = ({ requestsQuery, queryGetter, querySetter, filterOptions, searchParams, perPage, children }) => {
  const appName = useContext(AppNameContext);
  const sendCallout = useIntlCallout();
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const match = useRouteMatch();
  const okapiKy = useOkapiKy();
  const queryClient = useQueryClient();
  const stripes = useStripes();
  const [offset, setOffset] = useState(0);

  const requests = requestsQuery?.data?.pages?.[offset / perPage]?.results;
  const sparseRequests = (new Array(offset)).concat(requests);
  const totalCount = requestsQuery?.data?.pages?.[0]?.total;
  const parsedParams = queryString.parse(location.search);
  const sortOrder = parsedParams.sort || '';
  const fetchMore = (_askAmount, index) => {
    requestsQuery.fetchNextPage({ pageParam: index });
    setOffset(index);
  };
  const initialSearch = '?filters=terminal.false&sort=-dateCreated';

  useEffect(() => {
    // Update the search criteria to default if none found in location search
    if (!location.search || location.search === '') {
      history.push(location.pathname + initialSearch);
    }
  });

  const onPrintAll = () => {
    okapiKy(`rs/patronrequests/generatePickListBatch${searchParams}`).then(async res => {
      const { batchId } = await res.json();
      queryClient.invalidateQueries('rs/batch');
      history.push(`requests/batch/${batchId}/pullslip`, { direct: true });
    }).catch(async e => {
      const res = await e?.response?.text();
      sendCallout('ui-rs.pullSlip.error', 'error', { errMsg: (res.startsWith('{') ? JSON.parse(res)?.error : res) || (e.message ?? '') });
    });
  };

  const getActionMenu = () => (
    <FormattedMessage id="ui-rs.printAllPullSlips">
      {ariaLabel => (
        <Button
          id="clickable-print-pull-slips"
          aria-label={ariaLabel[0]}
          buttonStyle="dropdownItem"
          onClick={onPrintAll}
        >
          <Icon icon="print"><FormattedMessage id="ui-rs.printPullSlips" /></Icon>
        </Button>
      )}
    </FormattedMessage>
  );

  const { title, visibleColumns, createPerm } = appDetails[appName];

  return (
    <SearchAndSortQuery
      initialSearch={initialSearch}
      initialSearchState={{ query: '' }}
      key={location.search}
      queryGetter={queryGetter}
      querySetter={querySetter}
    >
      {
        ({
          activeFilters,
          filterChanged,
          getFilterHandlers,
          getSearchHandlers,
          onSort,
          onSubmitSearch,
          resetAll,
          searchChanged,
          searchValue,
        }) => (
          <div>
            <PersistedPaneset
              appId={`@projectreshare/${appName}`}
              id="requests"
            >
              <Pane
                defaultWidth="20%"
                paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
              >
                <form onSubmit={onSubmitSearch}>
                  <Search
                    filterChanged={filterChanged}
                    searchChanged={searchChanged}
                    searchHandlers={getSearchHandlers()}
                    searchValue={searchValue}
                    resetAll={resetAll}
                  />
                  {filterOptions &&
                    <Filters
                      activeFilters={activeFilters.state}
                      filterHandlers={getFilterHandlers()}
                      options={filterOptions}
                      appDetails={appDetails}
                    />
                  }
                </form>
              </Pane>
              {requestsQuery.isSuccess ?
                <Pane
                  actionMenu={getActionMenu}
                  appIcon={<AppIcon app={appName} iconKey="app" size="small" />}
                  defaultWidth="fill"
                  firstMenu={(
                    <>
                      {stripes.config?.reshare?.showRefresh &&
                        <PaneMenu>
                          { requestsQuery?.isRefetching ? <Loading /> : <IconButton icon="refresh" onClick={() => requestsQuery?.refetch()} /> }
                        </PaneMenu>
                      }
                    </>
                  )}
                  lastMenu={(
                    <PaneMenu>
                      {(appName === 'request') &&
                        <IfPermission perm={createPerm}>
                          <Button
                            buttonStyle="primary"
                            id="clickable-new-patron-request"
                            marginBottom0
                            to={`requests/create${location.search}`}
                          >
                            <FormattedMessage id="ui-rs.createPatronRequest" />
                          </Button>
                        </IfPermission>
                      }
                    </PaneMenu>
                  )}
                  noOverflow
                  padContent={false}
                  paneSub={requestsQuery?.isSuccess ?
                    <FormattedMessage
                      id="ui-rs.patronrequests.found"
                      values={{ number: totalCount }}
                    /> : ''}
                  paneTitle={title}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      flags: '',
                      hrid: <FormattedMessage id="ui-rs.patronrequests.id" />,
                      isRequester: <FormattedMessage id="ui-rs.patronrequests.isRequester" />,
                      dateCreated: <FormattedMessage id="ui-rs.patronrequests.dateCreated" />,
                      lastUpdated: <FormattedMessage id="ui-rs.patronrequests.lastUpdated" />,
                      title: <FormattedMessage id="ui-rs.patronrequests.title" />,
                      patronIdentifier: <FormattedMessage id="ui-rs.patronrequests.patronIdentifier" />,
                      state: <FormattedMessage id="ui-rs.patronrequests.state" />,
                      serviceType: <FormattedMessage id="ui-rs.patronrequests.serviceType" />,
                      requestingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.requestingInstitutionSymbol" />,
                      supplyingInstitutionSymbol: <FormattedMessage id="ui-rs.patronrequests.supplyingInstitutionSymbol" />,
                      selectedItemBarcode: <FormattedMessage id="ui-rs.patronrequests.selectedItemBarcode" />,
                      pickLocation: <FormattedMessage id="ui-rs.patronrequests.pickLocation" />,
                      pickShelvingLocation: <FormattedMessage id="ui-rs.patronrequests.pickShelvingLocation" />,
                      pickupLocation: <FormattedMessage id="ui-rs.patronrequests.pickupLocation" />,
                    }}
                    columnWidths={{
                      flags: '48px',
                      id: { max: 115 },
                      dateCreated: '96px',
                      lastUpdated: '96px',
                      state: { min: 84 },
                      serviceType: { max: 80 },
                      selectedItemBarcode: '130px',
                    }}
                    contentData={sparseRequests}
                    formatter={{
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
                      lastUpdated: a => (new Date(a.lastUpdated).toLocaleDateString() === new Date().toLocaleDateString()
                        ? <FormattedTime value={a.lastUpdated} />
                        : <FormattedDate value={a.lastUpdated} />),
                      patronIdentifier: a => {
                        const { patronGivenName, patronSurname } = a;
                        if (patronGivenName && patronSurname) return `${patronSurname}, ${patronGivenName}`;
                        if (patronSurname) return patronSurname;
                        if (patronGivenName) return patronGivenName;
                        return a.patronIdentifier;
                      },
                      state: a => <FormattedMessage id={`stripes-reshare.states.${a.state?.code}`} />,
                      serviceType: a => a.serviceType && a.serviceType.value,
                      supplyingInstitutionSymbol: a => (a?.resolvedSupplier?.owner?.symbolSummary ?? '').replace(/,.*/, ''),
                      title: a => a.title || a.titleOfComponent,
                      pickLocation: a => a.pickLocation && a.pickLocation.name,
                      pickShelvingLocation: a => a.pickShelvingLocation && a.pickShelvingLocation.name,
                      selectedItemBarcode: a => (a.volumes?.length <= 1 ? (a.volumes[0]?.itemId || a.selectedItemBarcode) : <FormattedMessage id="ui-rs.flow.info.itemBarcode.multiVolRequest" />)
                    }}
                    hasMargin
                    isEmptyMessage={
                      <>
                        <FormattedMessage id="ui-rs.patronrequests.notFound" /><br />
                        {location?.search?.includes('filter') &&
                          <Link to={queryString.exclude(`${location.pathname}${location.search}`, ['filters'])}>
                            <FormattedMessage id="ui-rs.patronrequests.withoutFilter" />
                          </Link>
                        }
                      </>
                    }
                    key={requestsQuery?.dataUpdatedAt}
                    loading={requestsQuery?.isFetching}
                    onHeaderClick={onSort}
                    onNeedMoreData={fetchMore}
                    onRowClick={(_e, rowData) => history.push(`${match.url}/${rowData.id}${location.search}`)}
                    pageAmount={perPage}
                    pagingType={MCLPagingTypes.PREV_NEXT}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    totalCount={totalCount}
                    visibleColumns={visibleColumns}
                  />
                </Pane>
                : <LoadingPane />
              }
              {children}
            </PersistedPaneset>
          </div>
        )
      }
    </SearchAndSortQuery>
  );
};

export default PatronRequests;
