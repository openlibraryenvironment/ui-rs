import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Row, Col, Checkbox, Select } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';

const NoticeField = ({ input, options }) => (
  <>
    <Row>
      <Col xs={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.template" />}
          name={`${input.name}.template.id`}
          dataOptions={options.templates}
          placeholder=" "
          validate={required}
          required
        />
      </Col>
      <Col xs={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.format" />}
          name={`${input.name}.format.id`}
          dataOptions={options.formats}
          placeholder=" "
          validate={required}
          required
        />
      </Col>
      <Col xs={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.trigger" />}
          name={`${input.name}.trigger.id`}
          dataOptions={options.triggers}
          placeholder=" "
          validate={required}
          required
        />
      </Col>
    </Row>
    <Field
      label={<FormattedMessage id="ui-rs.settings.noticePolicies.realTime" />}
      name={`${input.name}.realTime`}
      component={Checkbox}
      type="checkbox"
      required
      initialValue={input?.value?.realTime ?? true}
    />
  </>
);

export default NoticeField;
