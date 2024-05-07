import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { Button } from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

import NoticeField from './NoticeField';

const NoticeFieldArray = ({ fields: { name }, options }) => {
  const {
    items,
    onAddField,
    onDeleteField
  } = useKiwtFieldArray(name);

  return (
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
            />
          </EditCard>
        ))}
      </div>
      <Button id="add-period-button" onClick={() => onAddField()}>
        <FormattedMessage id="ui-rs.settings.noticePolicies.addNotice" />
      </Button>
    </>
  );
};

export default NoticeFieldArray;
