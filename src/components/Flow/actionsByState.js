/*
 * This object describes what to render for a request given its state:
 *
 * 'SOME_STATE': {
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
export default {
  'RES_IDLE':{
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: '',
    moreActions: ['RespondYes', 'CannotSupply', 'SendChatMessage'],
  },
  'RES_NEW_AWAIT_PULL_SLIP': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'PrintPullSlip',
    moreActions: ['SupplierMarkPullSlipPrinted', 'CannotSupply', 'SendChatMessage'],
  },
  'RES_AWAIT_PICKING': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'SupplierCheckInToReshare',
    moreActions: ['PrintPullSlip', 'CannotSupply'],
  },
  'RES_CHECKED_IN_TO_RESHARE': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'SupplierMarkShipped',
    moreActions: ['SupplierMarkShipped', 'PrintPullSlip', 'CannotSupply'],
  },
  'RES_ITEM_RETURNED': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'SupplierCheckOutOfReshare',
    moreActions: ['SupplierCheckOutOfReshare'],
  },
  'REQ_EXPECTS_TO_SUPPLY': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: '',
    moreActions: ['SendChatMessage'],
  },
  'REQ_SHIPPED': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'RequesterReceived',
    moreActions: ['RequesterReceived', 'PrintPullSlip'],
  },
  'REQ_CHECKED_IN': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'PatronReturnedItem',
    moreActions: ['PatronReturnedItem', 'ShippedReturn', 'PrintPullSlip'],
  },
  'REQ_AWAIT_RETURN_SHIPPING': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: 'ShippedReturn',
    moreActions: ['ShippedReturn', 'PrintPullSlip'],
  },
  'REQ_REQUEST_SENT_TO_SUPPLIER': {
    cards: ['Bibliographic', 'RequesterSupplier'],
    primaryAction: '',
    moreActions: ['SendChatMessage'],
  }
};
