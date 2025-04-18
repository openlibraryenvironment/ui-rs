import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';

const SupplierAddURLToDocument = ({ performAction }) => {
  const onSubmit = values => {
    return performAction('supplierAddURLToDocument', values, {
      success: 'ui-rs.actions.supplierAddURLToDocument.success',
      error: 'ui-rs.actions.supplierAddURLToDocument.error',
    });
  };
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormattedMessage id="ui-rs.actions.supplierAddURLToDocument.prompt" />
          <Row>
            <Col xs={11}>
              <Field name="url" component={TextField} autoFocus />
            </Col>
            <Col xs={1}>
              <Button buttonStyle="primary mega" type="submit" disabled={submitting}>
                <FormattedMessage id="ui-rs.actions.supplierAddURLToDocument.button" />
              </Button>
            </Col>
          </Row>
        </form>
      )}
    />
  );
};
SupplierAddURLToDocument.propTypes = {
  performAction: PropTypes.func.isRequired,
};
export default SupplierAddURLToDocument;
