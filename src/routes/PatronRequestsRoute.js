import React, { useMemo } from 'react';
import { useInfiniteQuery, useQueries } from 'react-query';
import { useIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { generateKiwtQuery, useKiwtSASQuery } from '@k-int/stripes-kint-components';
import PatronRequests from '../components/PatronRequests';

const PER_PAGE = 100;

const compareLabel = (a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);

const PatronRequestsRoute = ({ appName, children }) => {
  const intl = useIntl();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();
  const ky = useOkapiKy();

  const SASQ_MAP = {
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
    // Extra keys in the object are added to mod-rs params by generateKiwtQuery
    perPage: PER_PAGE,
    filters: `isRequester==${appName === 'request' ? 'true' : 'false'}`,
  };

  const states = useMemo(() => {
    const statePrefix = appName === 'supply' ? 'RES' : 'REQ';
    const keys = Object.keys(intl.messages).filter(
      key => key.startsWith(`stripes-reshare.states.${statePrefix}_`)
    );
    return keys
      .map(key => ({ label: intl.messages[key], value: key.replace('stripes-reshare.states.', '') }))
      .sort(compareLabel);
  }, [appName, intl]);
  const prQuery = useInfiniteQuery(
    {
      queryKey: [appName, 'patronRequests', query],
      queryFn: ({ pageParam = 0 }) => ky(
        `rs/patronrequests${generateKiwtQuery({ offset: pageParam, ...SASQ_MAP }, query)}`
      ).json(),
      useErrorBoundary: true,
    }
  );

  const filterQueries = useQueries([
    {
      queryKey: [appName, 'lmsLocations'],
      queryFn: () => ky('rs/hostLMSLocations', { searchParams: { perPage: '100' } }).json(),
      staleTime: 1000 * 60 * 60 * 2,
      useErrorBoundary: true,
    },
    {
      queryKey: [appName, 'institutions'],
      queryFn: () => ky('directory/entry', {
        searchParams: {
          filters: 'type.value=institution',
          perPage: '100',
          stats: 'true',
        }
      }).json(),
      staleTime: 1000 * 60 * 60 * 2,
      useErrorBoundary: true,
    },
  ]);

  let filterOptions;
  if (filterQueries.every(x => x.isSuccess)) {
    const [lmsLocations, { results: institutions }] = filterQueries.map(x => x.data);
    filterOptions = {
      hasUnread: [({ label: intl.formatMessage({ id: 'ui-rs.unread' }), value: 'unreadMessageCount>0' })],
      institution: institutions
        .map(x => ({ label: x.name, value: x.id }))
        .sort(compareLabel),
      location: lmsLocations
        .map(x => ({ label: x.name, value: x.id }))
        .sort(compareLabel),
      needsAttention: [({ label: intl.formatMessage({ id: 'ui-rs.needsAttention' }), value: 'true' })],
      state: states,
      terminal: [({ label: intl.formatMessage({ id: 'ui-rs.hideComplete' }), value: 'false' })],
    };
  }

  return (
    <PatronRequests
      requestsQuery={prQuery}
      queryGetter={queryGetter}
      querySetter={querySetter}
      filterOptions={filterOptions}
    >
      {children}
    </PatronRequests>
  );
};

export default PatronRequestsRoute;
