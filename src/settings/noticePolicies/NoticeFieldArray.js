import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button } from '@folio/stripes/components';
import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import NoticeField from './NoticeField';

const NoticeFieldArray = ({ items, name, templates, onAddField, onDeleteField }) => (
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
            dataOptions={templates}
            templates={templates}
            required
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
