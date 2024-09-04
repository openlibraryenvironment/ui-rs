import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';
import { useIsActionPending } from '@projectreshare/stripes-reshare';
import { useMessage } from '../MessageModalState';
import AddNoteField from '../AddNoteField';
import { includesNote } from './actionsByState';

const ScanConfirmAction = ({ performAction, request, action, prompt, error, success, intl }) => {
  const [, setMessage] = useMessage();
  const actionPending = !!useIsActionPending(request.id);
  const validActions = request.validActions.map(a => a.actionCode);
  const isSlnpItemBarcodeAction =
      request.stateModel?.shortcode === 'SLNPResponder' &&
      (validActions.includes('slnpSupplierCheckOutOfReshare')  ||
          validActions.includes('supplierMarkShipped')  ||
          validActions.includes('slnpSupplierFillAndMarkShipped'));

  const onSubmit = async values => {
    const inputValue = values?.reqId?.trim();

    if (!isSlnpItemBarcodeAction && values?.reqId?.trim() !== request.hrid) {
      setMessage('ui-rs.actions.wrongId', 'error');
      return { FORM_ERROR: intl.formatMessage({ id: 'ui-rs.actions.wrongId' }) };
    }

    if (isSlnpItemBarcodeAction) {
      return performAction(action, { itemBarcodes: [{itemId: inputValue}], note: values.note, }, { success, error });
    } else {
      return performAction(action, { note: values.note }, { success, error });
    }
  };

  const withNote = includesNote[action] ?? includesNote.default;
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          {prompt && isSlnpItemBarcodeAction && <FormattedMessage id={prompt + ".barcode"} />}
          {prompt && !isSlnpItemBarcodeAction && <FormattedMessage id={prompt} />}
          {!prompt &&
            <FormattedMessage id={`stripes-reshare.actions.${action}`}>
              {dispAction => <FormattedMessage id="ui-rs.actions.generic.prompt" values={{ action: dispAction }} />}
            </FormattedMessage>
          }
          <Row>
            <Col xs={11}>
              <Field name="reqId" component={TextField} autoFocus />
            </Col>
            <Col xs={1}>
              <Button buttonStyle="primary mega" type="submit" disabled={submitting || actionPending}>
                <FormattedMessage id="ui-rs.button.scan" />
              </Button>
            </Col>
          </Row>
          { withNote && <AddNoteField /> }
        </form>
      )}
    />
  );
};
ScanConfirmAction.propTypes = {
  performAction: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  error: PropTypes.string.isRequired,
  success: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};
export default injectIntl(ScanConfirmAction);
