import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Row, Col, Checkbox, Select } from '@folio/stripes/components';

const NoticeField = ({ input, options }) => (
  <>
    <Row>
      <Col md={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.template" />}
          name={`${input.name}.template`}
          dataOptions={options.templates}
          placeholder=" "
          required
        />
      </Col>
      <Col md={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.format" />}
          name={`${input.name}.format`}
          dataOptions={options.formats}
          placeholder=" "
          required
        />
      </Col>
      <Col md={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.trigger" />}
          name={`${input.name}.trigger`}
          dataOptions={options.triggers}
          placeholder=" "
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
