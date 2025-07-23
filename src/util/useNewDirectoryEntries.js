import { useOkapiQuery, useSetting } from '@projectreshare/stripes-reshare';

/** Fetches entries from the new directory from an array of symbol strings (the only parameter)
 *  or, if absent, the symbol configured at the default_request_symbol AppSetting.
 *
 *  Returns the react-query (which is only enabled if the router adapter setting is disabled)
 */
const useNewDirectoryEntries = (symbols) => {
  const routingAdapterSetting = useSetting('routing_adapter');
  const defaultRequesterSymbolSetting = useSetting('default_request_symbol', 'requests');
  return useOkapiQuery('directory/entries', {
    searchParams: {
      maximumRecords: '1000',
      cql: `symbol any ${symbols ? symbols.join(' ') : [defaultRequesterSymbolSetting.value]}`
    },
    staleTime: 2 * 60 * 60 * 1000,
    enabled: routingAdapterSetting.isSuccess === true && routingAdapterSetting.value === 'disabled'
  });
};

export default useNewDirectoryEntries;
