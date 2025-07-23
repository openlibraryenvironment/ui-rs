/**
 * Takes a list of tiers as returned by the new directory and arranges them in an
 * object keyed by symbol with added label/value properties for use with Select.
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
