import React from 'react';
import ActionReasonModal from '../ActionReasonModal';

export const SupplierCannotSupply = props => <ActionReasonModal action="supplierCannotSupply" reasonVocab="cannotSupplyReasons" reasonTranslationPrefix="ui-rs.settings.customiseListSelect.cannotSupplyReasons" {...props} />;
export const RequesterCancel = props => <ActionReasonModal action="requesterCancel" reasonVocab="cancellationReasons" {...props} />;
export const CancelLocal = props => <ActionReasonModal action="cancelLocal" reasonVocab="cancellationReasons" reasonTranslationPrefix="ui-rs.actions.requesterCancel.reasons" {...props} />;

export const Cancel = () => null;
export { default as RespondYes } from './RespondYes';
export { default as SupplierConditionalSupply } from './SupplierConditionalSupply';
export { default as SupplierAddCondition } from './SupplierAddCondition';
export { default as SupplierRespondToCancel } from './SupplierRespondToCancel';
