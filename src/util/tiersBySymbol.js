/** Fetches entries from the new directory from an array of symbol strings (the only parameter)
 *  or, if absent, the symbol configured at the default_request_symbol AppSetting.
 *
 *  Returns the react-query (which is only enabled if the router adapter setting is disabled)
 */
const tiersBySymbol = (entries) => {
  return entries?.filter?.(item => item.type === 'institution')
    ?.reduce?.((acc, item) => {
      const formattedTiers = item.tiers?.map(tier => ({
        label: tier.name,
        value: tier.id,
        ...tier
      }));

      item.symbols?.forEach(sym => {
        if (sym?.authority && sym?.symbol) {
          const symbolKey = `${sym.authority}:${sym.symbol}`;
          acc[symbolKey] = formattedTiers;
        }
      });

      return acc;
    }, {});
};

export default tiersBySymbol;
