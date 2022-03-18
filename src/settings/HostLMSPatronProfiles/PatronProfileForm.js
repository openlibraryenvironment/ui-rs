import { Field } from 'react-final-form';
import { Checkbox, Col, Row, TextField } from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';
import { FormattedMessage } from 'react-intl';

const PatronProfileForm = () => {
  return (
    <>
      <Row>
        <Col xs={6}>
          <Field
            name="name"
            label={<FormattedMessage id="ui-rs.settings.lmspprf.patronProfile" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            name="code"
            label={<FormattedMessage id="ui-rs.settings.lmspprf.code" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="canCreateRequests"
            label={<FormattedMessage id="ui-rs.settings.lmspprf.canCreateRequests" />}
            component={Checkbox}
            type="checkbox"
          />
        </Col>
      </Row>
    </>
  );
};

export default PatronProfileForm;
