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
*/
export default {
  'RES_NEW_AWAIT_PULL_SLIP': {
    cards: ['Citation'],
    primaryAction: ['PrintPullSlip'],
    moreActions: ['SupplierMarkPullSlipPrinted'],
  },
  // 'RES_AWAIT_PICKING': {}
};
