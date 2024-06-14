import initialToUpper from '../../util/initialToUpper';
/*
 * This object describes what to render for a request given its state (directories
 * relative to src/components/Flow).
 *
 * SOME_STATE: {
 *   flowComponents: <array of names of components exported from the FlowViewComponents directory>
 *   primaryAction: <name of component exported from the primaryActions directory>
 *   moreActions: <array of names of components exported from the moreActions directory>
 *   secondHeadline: <array of names of components exported from the secondHeadlines directory>
 * }
 *
 * moreActions will appear after any validActions provided on the request record. Custom
 * components will be used for validActions if available (eg. named after the action).
 * If no primaryAction is specified the first entry in validActions will be used, specify
 * a null primaryAction for states to suppress this.
 *
 * validActions without a component named for them will be rendered with the component
 * "Generic" which is roughly the ActionButton for moreActions and the ScanConfirmAction
 * for a primaryAction with accomodations for missing translations.
 *
 * excludesActions is for the VERY rare cases where an action IS a validAction,
 * but we do not want to explicitly render an action button for it.
 * Example - for RES_AWAIT_SHIP "supplierCheckInToReshare" is a validAction,
 * since FillMultiVolumeRequest is valid and uses that action.
 * However the generic "Fill request" option (which uses the same action on the backend)
 * no longer makes sense in this state, so needs to be excluded,
 * and FillMultiVolumeRequest rendered through "moreActions".
 *
 * Translations for generic components:
 *
 * stripes-reshare.actions.<action name> - name of action
 * stripes-reshare.actions.<action name>.success - message banner when action succeeds
 * stripes-reshare.actions.<action name>.error - message banner when action fails
 * ui-rs.actions.<action name>.prompt - prompt for scanning request barcode to exec
 *
 * Where the above are missing, stripes-reshare.actions.<action name> will be substituted into
 * ui-rs.actions.generic.* to provide generic success/error/prompt messages.
 *
*/

const noPrimary = {
  primaryAction: null,
};

export const actionsByState = {
  default: {
    flowComponents: ['TitleAndSILink', 'RequestInfo', 'ActionAccordion', 'Volumes', 'LoanConditions'],
    primaryAction: null,
    moreActions: [],
  },
  RES_IDLE: noPrimary,
  REQ_IDLE: noPrimary,
  REQ_INVALID_PATRON: noPrimary,
  RES_PENDING_CONDITIONAL_ANSWER: {
    primaryAction: 'SupplierMarkConditionsAgreed',
  },
  RES_NEW_AWAIT_PULL_SLIP: {
    primaryAction: 'PrintPullSlip',
  },
  RES_AWAIT_PICKING: {
    primaryAction: 'SupplierCheckInToReshare',
    moreActions: ['PrintPullSlip', 'FillMultiVolumeRequest'],
  },
  RES_COPY_AWAIT_PICKING: {
    primaryAction: 'nonreturnableSupplierAddURLToDocument',
    excludeActions: ['nonreturnableSupplierAddURLToDocument']
  },
  RES_AWAIT_PROXY_BORROWER: {
    moreActions: ['FillMultiVolumeRequest'],
  },
  RES_AWAIT_LMS_CHECKOUT: {
    primaryAction: 'supplierManualCheckout',
  },
  // TODO we will want to replace primary actions like this sometimes for multivol requests.
  // Perhaps have switch inside the default component itself?
  RES_AWAIT_SHIP: {
    primaryAction: 'supplierMarkShipped',
    moreActions: ['FillMultiVolumeRequest'],
    excludeActions: ['supplierCheckInToReshare']
  },
  RES_SEQUESTERED: {
    primaryAction: 'supplierFillDigitalLoan',
    excludeActions: ['supplierFillDigitalLoan'],
  },
  REQ_SHIPPED: {
    moreActions: ['PrintPullSlip'],
  },
  RES_CANCEL_REQUEST_RECEIVED:{
    primaryAction: 'SupplierRespondToCancel',
  },
  REQ_REQUEST_SENT_TO_SUPPLIER: noPrimary,
  REQ_EXPECTS_TO_SUPPLY: noPrimary,
  REQ_BORROWING_LIBRARY_RECEIVED: {
    primaryAction: 'RequesterManualCheckIn',
  },
  REQ_CHECKED_IN: {
    primaryAction: 'PatronReturnedItem',
    moreActions: ['PrintPullSlip'],
  },
  REQ_CONDITIONAL_ANSWER_RECEIVED: {
    primaryAction: 'RequesterAgreeConditions',
  },
  REQ_AWAITING_RETURN_SHIPPING: {
    moreActions: ['PrintPullSlip'],
  },
  REQ_LOCAL_REVIEW: {
    primaryAction: 'fillLocally',
  },
  REQ_CANCELLED: noPrimary,
  REQ_END_OF_ROTA: noPrimary,
  REQ_BLANK_FORM_REVIEW: noPrimary,
  REQ_DUPLICATE_REVIEW: noPrimary,
};

/* The idea behind this object is that we can use it to lookup whether or not any given action needs the ability to add a note or not,
   freeing us from having to change multiple places when any changes/additions are made.
*/
export const includesNote = {
  default: false,
  supplierPrintPullSlip: false,
  supplierManualCheckout: false,
  supplierMarkShipped: true,
  requesterCancel: true,
  requesterReceived: true,
  patronReturnedItem: false,
  shippedReturn: true,
  supplierCheckOutOfReshare: true,
  // Special cases, where this file isn't drawn from at the moment:
  // modals
  RespondYes: true,
  SupplierCannotSupply: true,
  SupplierConditionalSupply: true,
  // others, triggered by other means
  SupplierCheckInToReshare: false,
  PrintPullSlip: false,
};

/* Icons for generic more actions */
export const actionIcons = {
  supplierMarkShipped: 'archive',
  supplierPrintPullSlip: 'print',
};

/* Actions from request.validActions to exclude from all states when using the below function */
export const excludeRemote = [
  'message',
  'manualClose',
  'supplierCheckInToReshareAndSupplierMarkShipped', // This will replace the action performed by "fill request" depending on config
  'patronReturnedItemAndShippedReturn'// This will replace the action performed by "mark returned by patron" depending on config
];

/* Actions from request.validActions that cannot become the primary action */
const excludePrimary = ['requesterCancel'];

/* UI-only actions to exclude from electronic requests */
const excludeElectronic = ['FillMultiVolumeRequest'];

/* This function returns the contextual actions for a provided request,
 * falling back to the default for unknown states.
 */
export const actionsForRequest = request => {
  /* Since state model types aren't implemented yet and deliveryMethod won't necessarily be set we currently
  need to rely on discrete state model codes to determine if a request is electronic */
  const isElectronic = ['CDLResponder', 'DigitalReturnableRequester'].includes(request.stateModel?.shortcode);
  const actions = { ...actionsByState.default, ...actionsByState[request.state?.code] || {} };
  if (Array.isArray(request.validActions)) {
    const remote = request.validActions.filter(
      action => actions.primaryAction !== initialToUpper(action) && !(excludeRemote.includes(action)) && !(actions.excludeActions?.includes(action))
    );
    const client = actions.moreActions.filter(
      action => !(remote.includes(`${action.charAt(0).toLowerCase()}${action.substring(1)}`))
        && !(isElectronic && excludeElectronic.includes(action))
    );
    actions.moreActions = remote.concat(client);
    const maybePrimary = remote.filter(action => !excludePrimary.includes(action));
    if (maybePrimary.length > 0 && actionsByState?.[request.state?.code]?.primaryAction === undefined) actions.primaryAction = maybePrimary[0];
  }
  return actions;
};
