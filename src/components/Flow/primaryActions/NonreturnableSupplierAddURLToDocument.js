import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';

const NonreturnableSupplierAddURLToDocument = ({ performAction }) => {
  const onSubmit = values => {
    return performAction('nonreturnableSupplierAddURLToDocument', values, {
      success: 'ui-rs.actions.nonreturnableSupplierAddURLToDocument.success',
      error: 'ui-rs.actions.nonreturnableSupplierAddURLToDocument.error',
    });
  };
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormattedMessage id="ui-rs.actions.nonreturnableSupplierAddURLToDocument.prompt" />
          <Row>
            <Col xs={11}>
              <Field name="url" component={TextField} autoFocus />
            </Col>
            <Col xs={1}>
              <Button buttonStyle="primary mega" type="submit" disabled={submitting}>
                <FormattedMessage id="ui-rs.actions.nonreturnableSupplierAddURLToDocument.button" />
              </Button>
            </Col>
          </Row>
        </form>
      )}
    />
  );
};
NonreturnableSupplierAddURLToDocument.propTypes = {
  performAction: PropTypes.func.isRequired,
};
export default NonreturnableSupplierAddURLToDocument;
