import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Row, Col, Checkbox, Select } from '@folio/stripes/components';

const NoticeField = ({ input, templates }) => (
  <>
    <Row>
      <Col xs={4}>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.template" />}
          name={`${input.name}.template`}
          dataOptions={templates}
          placeholder=" "
          required
        />
        <Field
          label={<FormattedMessage id="ui-rs.settings.noticePolicies.realTime" />}
          name={`${input.name}.realTime`}
          component={Checkbox}
          type="checkbox"
          required
          initialValue={input?.value?.realTime ?? true}
        />
      </Col>
    </Row>
  </>
);

export default NoticeField;
