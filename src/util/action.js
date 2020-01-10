// An attempt to abstract out the business of posting actions to mod-rs

export const actionManifestEntry = {
  type: 'okapi',
  path: 'rs/patronrequests/:{id}/performAction',
  fetch: false,
  clientGeneratePk: false,
};

/*
// I wanted to use performActionViaManifest in FlowRoute.js and my own app, as:
//   const performAction = (a, p, s, e) => performActionViaManifest(props.mutator.action, a, p, s, e);
// But this fails because hooks are too magical and can only be invoked from within functional components.
// So I don't at present have a good way to abstract our the action-posting behaviour.
// The best we can do is the rather trivial postAction function

import { useMessage } from '../components/MessageModalState';

export const performActionViaManifest = (mutator, action, payload, successMessage, errorMessage) => {
  const [, setMessage] = useMessage();
  console.log('performActionViaManifest, payload =', payload);
  mutator.POST({ action, actionParams: payload || {} })
    .then(() => setMessage(successMessage, 'success'))
    .catch(() => setMessage(errorMessage, 'error'));
};
*/

export const postAction = (mutator, action, payload) => {
  return mutator.POST({ action, actionParams: payload || {} });
};
