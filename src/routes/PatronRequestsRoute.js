import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { generateKiwtQuery, useKiwtSASQuery } from '@k-int/stripes-kint-components';
import { useOkapiQuery, useSetting, useSettings } from '@projectreshare/stripes-reshare';
import PatronRequests from '../components/PatronRequests';
import useFilteredSelectifiedRefdata from '../util/useFilteredSelectifiedRefdata';

const PER_PAGE = 100;

const compareLabel = (a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);
const compareCreated = (a, b) => (new Date(b?.dateCreated) - new Date(a?.dateCreated));

const SLNP_PREFIX = 'SLNP';
const STATE_MODEL_RESPONDER = 'responder_returnables_state_model';
const STATE_MODEL_REQUESTER = 'requester_returnables_state_model';
const SLNP_REQ_TRANSLATION_PREFIX = 'SLNP_REQ';
const SLNP_RESP_TRANSLATION_PREFIX = 'SLNP_RES';
const REQ_TRANSLATION_PREFIX = 'REQ';
const RESP_TRANSLATION_PREFIX = 'RES';
const SUPPLIER = 'supply';

const PatronRequestsRoute = ({ appName, children }) => {
  const intl = useIntl();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();
  const ky = useOkapiKy();
  const isSupplier = appName === SUPPLIER;

  const SASQ_MAP = {
    searchKey: 'id,hrid,patronGivenName,patronSurname,patronIdentifier,title,author,issn,isbn,volumes.itemId,selectedItemBarcode',
    // Omitting the date and unread filter keys here causes it to include their value verbatim
    // rather than adding the key name and operator. This way we can store the operator and field
    // in the value eg. how the hasUnread checkbox sets a value of 'unreadMessageCount>0'.
    filterKeys: {
      'batch': 'batches.id',
      'r': 'isRequester',
      'needsAttention': 'state.needsAttention',
      'state': 'state.code',
      'location': 'pickLocation.id',
      'requester': 'resolvedRequester.owner.id',
      'shelvingLocation': 'pickShelvingLocation.id',
      'supplier': 'resolvedSupplier.owner.id',
      'terminal': 'state.terminal',
      'serviceLevel': 'serviceLevel.value',
      'serviceType': 'serviceType.value'
    },
    sortKeys: {
      'pickLocation': 'pickLocation.name',
      'pickShelvingLocation': 'pickShelvingLocation.name',
      'supplyingInstitutionSymbol': 'resolvedSupplier.symbol',
    },
    // Extra keys in the object are added to mod-rs params by generateKiwtQuery
    perPage: PER_PAGE,
    filters: [{
      path: 'isRequester',
      value: isSupplier ? 'false' : 'true'
    }],
  };

  const getPrefixValueByStateModel = (data, stateModel, isRequester) => {
    const includesSlnpPrefixValue = data.some(d => d.key === stateModel && d.value?.includes(SLNP_PREFIX));
    return isRequester
      ? includesSlnpPrefixValue ? SLNP_REQ_TRANSLATION_PREFIX : REQ_TRANSLATION_PREFIX
      : includesSlnpPrefixValue ? SLNP_RESP_TRANSLATION_PREFIX : RESP_TRANSLATION_PREFIX;
  };

  const getStatePrefix = (data) => {
    if (data) {
      const stateModel = isSupplier ? STATE_MODEL_RESPONDER : STATE_MODEL_REQUESTER;
      const isRequester = !isSupplier;
      return getPrefixValueByStateModel(data, stateModel, isRequester);
    } else {
      return isSupplier ? RESP_TRANSLATION_PREFIX : REQ_TRANSLATION_PREFIX;
    }
  };

  const getStates = (data) => {
    const statePrefix = getStatePrefix(data);

    const keys = Object.keys(intl.messages).filter(
      key => key.startsWith(`stripes-reshare.states.${statePrefix}_`)
    );
    return keys
      .map(key => ({ label: intl.messages[key], value: key.replace('stripes-reshare.states.', '') }))
      .sort(compareLabel);
  };

  const getRequestServiceTypes = (refDataRequestServiceType) => {
    if (refDataRequestServiceType) {
      return refDataRequestServiceType[0]
        .values
        .map(x => ({ label: x.label, value: x.value }))
        .sort(compareLabel);
    }
    return [];
  };

  const prQuery = useInfiniteQuery(
    {
      queryKey: ['rs/patronrequests', query, `@projectreshare/${appName}`],
      queryFn: ({ pageParam = 0 }) => ky(`rs/patronrequests${generateKiwtQuery({ offset: pageParam, ...SASQ_MAP }, query)}`).json(),
      useErrorBoundary: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      // we render before useKiwtSASQuery() finishes, let's prevent an extra, unnecessary, fetch
      enabled: Object.prototype.hasOwnProperty.call(query, 'query'),
    }
  );

  const [serviceLevels, serviceLevelsLoaded] = useFilteredSelectifiedRefdata('ServiceLevels', 'other', 'displayed_service_levels', 'ui-rs.refdata.serviceLevel');

  const filterQueries = [
    useOkapiQuery('rs/batch', {
      searchParams: {
        perPage: '1000',
        filters: isSupplier ? 'isRequester!=true' : 'isRequester==true',
      },
      staleTime: 15 * 60 * 1000
    }),
    useOkapiQuery('rs/hostLMSLocations', { searchParams: { perPage: '1000' }, staleTime: 2 * 60 * 60 * 1000 }),
    useOkapiQuery('rs/shelvingLocations', { searchParams: { perPage: '1000' }, staleTime: 2 * 60 * 60 * 1000 }),
    useSettings(),
    useOkapiQuery('rs/refdata', {
      searchParams: {
        filters: 'desc=request.serviceType',
      },
      staleTime: 2 * 60 * 60 * 1000
    })
  ];

  const routingAdapterSetting = useSetting('routing_adapter');
  const dirQuery = useOkapiQuery('directory/entry', {
    searchParams: {
      filters: 'type.value=institution',
      perPage: '1000',
      stats: 'true',
    },
    staleTime: 2 * 60 * 60 * 1000,
    useErrorBoundary: false,
    enabled: routingAdapterSetting.isSuccess === true && routingAdapterSetting.value !== 'disabled'
  });

  let filterOptions;
  if (filterQueries.every(x => x.isSuccess) && serviceLevelsLoaded) {
    const [batches, lmsLocations, shelvingLocations, settings, serviceType] = filterQueries.map(x => x.data);
    filterOptions = {
      batch: batches
        .sort(compareCreated)
        .map(x => ({ label: x.description, value: x.id, dateCreated: x.dateCreated })),
      hasCost: [({ label: intl.formatMessage({ id: 'ui-rs.hasCost' }), value: 'cost>0' })],
      hasLocalNote: [({ label: intl.formatMessage({ id: 'stripes-reshare.hasLocalNote' }), value: 'localNote ISNOTNULL' })],
      hasUnread: [({ label: intl.formatMessage({ id: 'ui-rs.unread' }), value: 'hasUnreadMessages=true' })],
      location: lmsLocations
        .map(x => ({ label: x.name, value: x.id }))
        .sort(compareLabel),
      needsAttention: [({ label: intl.formatMessage({ id: 'ui-rs.needsAttention' }), value: 'true' })],
      shelvingLocation: shelvingLocations
        .map(x => ({ label: x.name, value: x.id }))
        .sort(compareLabel),
      state: getStates(settings),
      terminal: [({ label: intl.formatMessage({ id: 'ui-rs.hideComplete' }), value: 'false' })],
      serviceLevel: serviceLevels,
      serviceType: getRequestServiceTypes(serviceType)
    };

    if (dirQuery.isSuccess) {
      filterOptions.institutions = dirQuery.data?.results
        ?.map(x => ({ label: x.name, value: x.id })).sort(compareLabel);
    }
  }

  if (dirQuery.isLoading) {
    return null;
  }

  return (
    <PatronRequests
      requestsQuery={prQuery}
      queryGetter={queryGetter}
      querySetter={querySetter}
      filterOptions={filterOptions}
      searchParams={generateKiwtQuery(SASQ_MAP, query)}
      perPage={PER_PAGE}
      key={JSON.stringify(query)}
    >
      {children}
    </PatronRequests>
  );
};

export default PatronRequestsRoute;
