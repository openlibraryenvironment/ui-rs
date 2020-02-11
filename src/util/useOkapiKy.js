/*
 * Ky (https://github.com/sindresorhus/ky) is a convenient wrapper over
 * browsers' fetch() implementation, allowing you to avoid much of the tedious
 * promise-resolution and error-checking that raw fetch() needs by combining it
 * all into one promise.
 *
 * useOkapiKy is a hook that sets up a Ky object that prefixes everything with
 * the Okapi URL and adds headersfor tenant and token.
 *
 * Example usage:
 *
 * SomeComponent = props => {
 *  const ky = useOkapiKy();
 *  ky('circulation/check-in-by-barcode', {
 *    method: 'POST',
 *    JSON: { some: 'object to encode to json...' },
 *  }).then(res => {
 *    if (res.ok) {
 *      //...success!
 *    } else {
 *      //...error :(
 *    }
 *  });
 * };
 *
 */
import ky from 'ky';
import { useStripes } from '@folio/stripes/core';

export default () => {
  const { tenant, token, url } = useStripes().okapi;
  return ky.create({
    prefixUrl: url,
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set('X-Okapi-Tenant', tenant);
          request.headers.set('X-Okapi-Token', token);
        }
      ]
    }
  });
};
