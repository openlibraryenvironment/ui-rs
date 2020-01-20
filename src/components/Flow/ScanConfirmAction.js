import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { useMessage } from '../MessageModalState';

const ScanConfirmAction = ({ performAction, request, action, prompt, error, success, intl }) => {
  const [, setMessage] = useMessage();
  const onSubmit = async values => {
    if (values.reqId.trim() !== request.id) {
      setMessage('ui-rs.actions.wrongId', 'error');
      return { FORM_ERROR: intl.formatMessage({ id: 'ui-rs.actions.wrongId' }) };
    }
    return performAction(action, {}, success, error);
  };
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <SafeHTMLMessage id={prompt} />
          <Row>
            <Col xs={11}>
              <Field name="reqId" component={TextField} autoFocus />
            </Col>
            <Col xs={1}>
              <Button buttonStyle="primary mega" type="submit" disabled={submitting}>
                <FormattedMessage id="ui-rs.button.scan" />
              </Button>
            </Col>
          </Row>
        </form>
      )}
    />
  );
};
ScanConfirmAction.propTypes = {
  performAction: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};
export default injectIntl(ScanConfirmAction);
