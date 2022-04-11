import { Field, useFormState } from 'react-final-form';
import { Col, Row, TextField, MessageBanner } from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';
import { FormattedMessage } from 'react-intl';

const ShelvingLocationForm = () => {
  const formState = useFormState();
  return (
    <>
      {formState.hasSubmitErrors && <MessageBanner type="error">{formState.submitError}</MessageBanner>}
      <Row>
        <Col xs={6}>
          <Field
            name="name"
            label={<FormattedMessage id="ui-rs.settings.lmsshlv.shelvingLocation" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            name="code"
            label={<FormattedMessage id="ui-rs.settings.lmsshlv.code" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="supplyPreference"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />}
            component={TextField}
            type="number"
            parse={v => v}
          />
        </Col>
      </Row>
    </>
  );
};

export default ShelvingLocationForm;
