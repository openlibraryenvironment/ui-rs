import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField } from '@folio/stripes/components';
import useActionConfig from '../useActionConfig';
import { useIntlCallout } from '@projectreshare/stripes-reshare';

const PatronReturnedItem = ({ performAction, request }) => {
  const sendCallout = useIntlCallout();
  // eslint-disable-next-line camelcase
  const { combine_returned_by_patron_and_return_ship } = useActionConfig();
  // eslint-disable-next-line camelcase
  const combine = combine_returned_by_patron_and_return_ship === 'yes';

  const onSubmit = values => {
    const isRequesterSLNP = request.stateModel?.shortcode === 'SLNPRequester';
    const isWrongId = values?.itemBarcodes[0].itemId?.trim() !== request.hrid;

    if (isRequesterSLNP && isWrongId) {
      sendCallout('ui-rs.actions.wrongId', 'error');
      return;
    }

    performAction(
      combine ?
        'patronReturnedItemAndShippedReturn' :
        'patronReturnedItem',
        values, {
          success: combine ? 'ui-rs.actions.checkIn.patron.combined.success' : 'ui-rs.actions.checkIn.patron.success',
          error: 'ui-rs.actions.checkIn.error',
        }
    );
  }
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
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
