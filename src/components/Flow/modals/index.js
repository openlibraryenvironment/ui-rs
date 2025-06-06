import React from 'react';
import ActionReasonModal from '../ActionReasonModal';

export const SupplierCannotSupply = props => <ActionReasonModal action="supplierCannotSupply" reasonVocab="cannotSupplyReasons" {...props} />;
export const NonreturnableSupplierRespondCannotSupply = props => <ActionReasonModal action="nonreturnableSupplierRespondCannotSupply" reasonVocab="cannotSupplyReasons" {...props} />;
export const RequesterCancel = props => <ActionReasonModal action="requesterCancel" reasonVocab="cancellationReasons" {...props} />;
export const CancelLocal = props => <ActionReasonModal action="cancelLocal" reasonVocab="cancellationReasons" {...props} />;
export const SlnpAbortSupply = props => <ActionReasonModal action="slnpAbortSupply" reasonVocab="slnpCancelOrAbortSupplyReasons" {...props} />;

export const Cancel = () => null;
export { default as FillMultiVolumeRequest } from './FillMultiVolumeRequest';
export { default as ManualClose } from './ManualClose';
export { default as RespondYes } from './RespondYes';
export { default as SupplierConditionalSupply } from './SupplierConditionalSupply';
export { default as SupplierAddCondition } from './SupplierAddCondition';
export { default as SupplierRespondToCancel } from './SupplierRespondToCancel';
export { default as UploadToFill } from './UploadToFill';
