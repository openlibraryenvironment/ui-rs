import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';
import useActionConfig from '../useActionConfig';

const PatronReturnedItem = ({ performAction }) => {
  // eslint-disable-next-line camelcase
  const { combine_returned_by_patron_and_return_ship } = useActionConfig();
  // eslint-disable-next-line camelcase
  const combine = combine_returned_by_patron_and_return_ship === 'yes';

  const onSubmit = values => performAction(
    combine ?
      'patronReturnedItemAndShippedReturn' :
      'patronReturnedItem',
    values, {
      success: 'ui-rs.actions.checkIn.success',
      error: 'ui-rs.actions.checkIn.error',
    }
  );
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormattedMessage id={`ui-rs.actions.${combine ? 'patronReturnedItemAndShipped' : 'patronReturnedItem'}.prompt`} />
          <Row>
            <Col xs={11}>
              <Field name="itemBarcodes[0].itemId" component={TextField} autoFocus />
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
PatronReturnedItem.propTypes = {
  performAction: PropTypes.func.isRequired,
};
export default PatronReturnedItem;
