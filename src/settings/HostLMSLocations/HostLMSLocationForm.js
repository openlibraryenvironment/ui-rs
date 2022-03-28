import { Field } from 'react-final-form';
import { Col, Row, Select, TextField } from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';
import { FormattedMessage } from 'react-intl';

const HostLMSLocationForm = ({ dirOptions }) => {
  return (
    <>
      <Row>
        <Col xs={6}>
          <Field
            name="name"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.hostLMSLocation" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            name="code"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.code" />}
            component={TextField}
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="icalRrule"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.icalRrule" />}
            component={TextField}
            parse={v => v}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            name="correspondingDirectoryEntry"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.correspondingDirectoryEntry" />}
            component={Select}
            dataOptions={dirOptions}
            format={v => v?.id ?? ''}
            parse={v => ({ id: v })}
          />
        </Col>
        <Col xs={6}>
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

export default HostLMSLocationForm;
