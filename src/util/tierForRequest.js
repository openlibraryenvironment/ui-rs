/**
 * Takes a request and list of tiers and returns the tier associated with that request
 * or undefined if none matches.
 */
const tierForRequest = (request, tiers) => {
  return tiers?.find?.(t => t.level?.toLowerCase() === request.serviceLevel?.value?.toLowerCase()
      && t.cost === request.maximumCostsMonetaryValue
      && t.type?.toLowerCase() === request.serviceType?.value?.toLowerCase());
};

export default tierForRequest;
