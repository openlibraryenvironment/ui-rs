/*
 * This object describes what to render for a request given its state:
 *
 * SOME_STATE: {
 *   cards: <array of names of components exported from the cardsByRequest directory>
 *   primaryAction: <name of component exported from the primaryActions directory>
 *   moreActions: <array of names of components exported from the moreActions directory>
 *   secondHeadline: <array of names of components exported from the secondHeadlines directory>
 *   excludeFromMore: <array of moreActions to only display in the dropdown>
 * }
 *
 * In order to add a new action to moreActions - extend src/components/Flow/moreActions/index.js and add
 * your action.
*/
export const actionsByState = {
  default: {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: null,
    moreActions: [],
  },
  RES_IDLE:{
    primaryAction: '',
    moreActions: ['RespondYes', 'CannotSupply'],
  },
  RES_NEW_AWAIT_PULL_SLIP: {
    primaryAction: 'PrintPullSlip',
    moreActions: ['SupplierMarkPullSlipPrinted', 'CannotSupply'],
  },
  RES_AWAIT_PICKING: {
    primaryAction: 'SupplierCheckInToReshare',
    moreActions: ['PrintPullSlip', 'CannotSupply'],
  },
  RES_CHECKED_IN_TO_RESHARE: {
    primaryAction: 'SupplierMarkShipped',
    moreActions: ['SupplierMarkShipped', 'PrintPullSlip', 'CannotSupply'],
  },
  RES_AWAIT_PROXY_BORROWER: {
    primaryAction: 'ManualCheckout',
    moreActions: ['ManualCheckout'],
  },
  RES_AWAIT_LMS_CHECKOUT: {
    primaryAction: 'ManualCheckout',
    moreActions: ['ManualCheckout'],
  },
  RES_ITEM_RETURNED: {
    primaryAction: 'SupplierCheckOutOfReshare',
    moreActions: ['SupplierCheckOutOfReshare'],
  },
  RES_AWAIT_SHIP: {
    primaryAction: 'SupplierMarkShipped',
    moreActions: ['SupplierMarkShipped'],
  },
  REQ_SHIPPED: {
    primaryAction: 'RequesterReceived',
    moreActions: ['RequesterReceived', 'PrintPullSlip'],
  },
  REQ_BORROWING_LIBRARY_RECEIVED: {
    primaryAction: 'RequesterManualCheckIn',
  },
  REQ_CHECKED_IN: {
    primaryAction: 'PatronReturnedItem',
    moreActions: ['PatronReturnedItem', 'ShippedReturn', 'PrintPullSlip'],
  },
  REQ_AWAITING_RETURN_SHIPPING: {
    primaryAction: 'ShippedReturn',
    moreActions: ['ShippedReturn', 'PrintPullSlip'],
  }
};

/* This function returns the contextual actions for a provided request,
 * falling back to the default for unknown states.
 */
export const actionsForRequest = request => Object.assign({}, actionsByState.default, actionsByState[request.state.code] || {});
