// Return a location n levels higher than the present one, incuding
// the search part of the present URL. (We can't just use '../../..',
// because that discards the search even if it's explicitly added.)
//
// Invoke as `upNLevels(this.props.location, n)`.

function upNLevels(location, n) {
  const segment = '/[^/]*'.repeat(n);
  const re = new RegExp(`${segment}$`);
  return `${location.pathname.replace(re, '')}${location.search}`;
}

export default upNLevels;
