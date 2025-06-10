import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FileUploader } from '@folio/stripes-data-transfer-components';
import { Modal, ModalFooter } from '@folio/stripes/components';
import { useOkapiKy, useStripes } from '@folio/stripes/core';
// import { useIntlCallout, useIsActionPending } from '@projectreshare/stripes-reshare';
import { useIntlCallout } from '@projectreshare/stripes-reshare';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const Footer = () => (
  <ModalFooter>
    <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
  </ModalFooter>
);

const UploadToFill = ({ _request, performAction }) => {
  // const actionPending = !!useIsActionPending(request.id);
  const [currentModal, setModal] = useModal();
  const closeModal = () => setModal(null);
  const okapiKy = useOkapiKy().extend({ timeout: false });
  const sendCallout = useIntlCallout();
  const stripes = useStripes();
  const maxUpload = stripes.config?.reshare?.maxDMSUpload;

  const upload = async (dropped) => {
    const formData = new FormData();
    formData.set('file', dropped[0]);
    formData.set('description', dropped[0]?.name);
    const uploadResult = await okapiKy.post('dms/upload', { body: formData }).json();
    await performAction('supplierAddURLToDocument', { url: uploadResult.url }, {
      success: 'ui-rs.actions.uploadToFill.success',
      error: 'ui-rs.actions.uploadToFill.error',
    });
    closeModal();
  };

  const onDrop = async (dropped) => {
    upload(dropped).catch(async e => {
      const res = await e?.response?.text();
      const errMsg = res ?? e.message;
      sendCallout('ui-rs.actions.uploadToFill.error', 'error', { errMsg });
    });
  };


  return (
    <Modal
      label={<FormattedMessage id="ui-rs.actions.uploadToFill" />}
      open={currentModal === 'UploadToFill'}
      onClose={closeModal}
      dismissible
      footer={<Footer />}
    >
      <FileUploader
        title={<FormattedMessage id="ui-rs.actions.uploadToFill.drop" />}
        uploadButtonText={<FormattedMessage id="ui-rs.actions.uploadToFill.button" />}
        onDrop={onDrop}
        maxSize={maxUpload * 1024 * 1024}
        // isDropZoneActive={!actionPending}
      >
        {maxUpload && <FormattedMessage id="ui-rs.actions.uploadToFill.max" values={{ max: maxUpload }} />}
      </FileUploader>
    </Modal>
  );
};

export default UploadToFill;
