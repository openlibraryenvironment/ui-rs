import { Field, useFormState } from 'react-final-form';
import { Checkbox, Col, Row, TextField, MessageBanner } from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';
import { FormattedMessage } from 'react-intl';

const ItemLoanPolicyForm = () => {
  const formState = useFormState();
  return (
    <>
      {formState.hasSubmitErrors && <MessageBanner type="error">{formState.submitError}</MessageBanner>}
      <Row>
        <Col xs={6}>
          <Field
            name="name"
            label={<FormattedMessage id="ui-rs.settings.lmsilp.itemLoanPolicy" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            name="code"
            label={<FormattedMessage id="ui-rs.settings.lmsilp.code" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="lendable"
            label={<FormattedMessage id="ui-rs.settings.lmsilp.lendable" />}
            component={Checkbox}
            type="checkbox"
          />
        </Col>
      </Row>
    </>
  );
};

export default ItemLoanPolicyForm;
