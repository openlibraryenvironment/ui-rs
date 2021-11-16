import React, { useContext } from 'react';
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl
} from 'react-intl';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import {
  Badge,
  Button,
  LoadingPane,
  MultiColumnList,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { SearchAndSortQuery, PersistedPaneset } from '@folio/stripes/smart-components';
import AppNameContext from '../../AppNameContext';
import PrintAllPullSlips from '../PrintAllPullSlips';
import Filters from './Filters';
import Search from './Search';

const appDetails = {
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

const PatronRequests = ({ requestsQuery, queryGetter, querySetter, filterOptions, children }) => {
  const appName = useContext(AppNameContext);
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const match = useRouteMatch();

  const requests = requestsQuery?.data?.pages?.flatMap(x => x.results);
  const totalCount = requestsQuery?.data?.pages?.[0]?.total;
  const fetchMore = (_askAmount, index) => {
    requestsQuery.fetchNextPage({ pageParam: index });
  };

  const getActionMenu = () => (
    <Link to={`${match.url}/printslips${location.search}`}>
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

  const { title, visibleColumns, createPerm } = appDetails[appName];

  if (match.params.action === 'printslips') {
    return <PrintAllPullSlips query={requestsQuery} />;
  }

  return (
    <SearchAndSortQuery
      initialSearchState={{ query: '' }}
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
              appId={`@reshare/${appName}`}
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
                  lastMenu={(
                    <IfPermission perm={createPerm}>
                      <PaneMenu>
                        <Button
                          buttonStyle="primary"
                          id="clickable-new-patron-request"
                          marginBottom0
                          to={`requests/create${location.search}`}
                        >
                          <FormattedMessage id="stripes-smart-components.new" />
                        </Button>
                      </PaneMenu>
                    </IfPermission>
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
                    contentData={requests}
                    formatter={{
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
                      supplyingInstitutionSymbol: a => (a?.resolvedSupplier?.owner?.symbolSummary ?? '').replace(/,.*/, ''),
                      pickLocation: a => a.pickLocation && a.pickLocation.name,
                      selectedItemBarcode: a => (a.volumes?.length <= 1 ? a.volumes[0]?.itemId : <FormattedMessage id="ui-rs.flow.info.itemBarcode.multiVolRequest" />)
                    }}
                    hasMargin
                    loading={requestsQuery?.isFetching}
                    onHeaderClick={onSort}
                    onNeedMoreData={fetchMore}
                    onRowClick={(_e, rowData) => history.push(`${match.url}/view/${rowData.id}${location.search}`)}
                    totalCount={totalCount}
                    virtualize
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
