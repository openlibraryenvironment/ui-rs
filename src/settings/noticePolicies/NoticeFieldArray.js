import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button } from '@folio/stripes/components';
import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import { required } from '@folio/stripes/util';

import NoticeField from './NoticeField';

const NoticeFieldArray = ({ items, name, options, onAddField, onDeleteField }) => (
  <>
    <div>
      {items.map((notice, index) => (
        <EditCard
          key={index}
          onDelete={() => onDeleteField(index, notice)}
          header=""
        >
          <Field
            component={NoticeField}
            index={index}
            name={`${name}[${index}]`}
            options={options}
            required
            validate={required}
          />
        </EditCard>
      ))}
    </div>
    <Button id="add-period-button" onClick={() => onAddField()}>
      <FormattedMessage id="ui-rs.settings.noticePolicies.addNotice" />
    </Button>
  </>
);

export default withKiwtFieldArray(NoticeFieldArray);
