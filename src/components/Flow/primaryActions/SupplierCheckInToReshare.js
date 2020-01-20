import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

const SupplierCheckInToReshare = ({ performAction }) => {
  const onSubmit = values => performAction(
    'supplierCheckInToReshare',
    values,
    'ui-rs.actions.checkIn.success',
    'ui-rs.actions.checkIn.error',
  );
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <SafeHTMLMessage id="ui-rs.actions.checkIn.prompt" />
          <Row>
            <Col xs={11}>
              <Field name="itemBarcode" component={TextField} autoFocus />
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
SupplierCheckInToReshare.propTypes = {
  performAction: PropTypes.func.isRequired,
};
export default SupplierCheckInToReshare;
