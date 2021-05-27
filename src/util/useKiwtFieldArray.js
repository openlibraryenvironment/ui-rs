import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray } from 'react-final-form-arrays'
const useKiwtFieldArray = (name) => {
  const { fields } = useFieldArray(name);
  const { value: values } = fields;
  const [ endOfList, setEndOfList ] = useState(0);

  useEffect(() => {
    const items = values.filter(line => !line._delete);
    setEndOfList(items.length)
  }, [values])

  const onAddField = (field = { _delete: false }) => {
    fields.insert(endOfList, field);
  }

  const onDeleteField = (index, field) => {
    fields.remove(index);
    onMarkForDeletion(field);
  }

  const onMarkForDeletion = (field) => {
    if (field && field.id) {
      fields.push({ ...field, _delete: true });
    }
  }

  const onPrependField = (field = { _delete: false }) => {
    fields.unshift(field);
  }

  const onReplaceField = (index, field) => {
    if (fields.update) { // react-final-form-arrays
      fields.update(index, field);
    }
  }

  const onUpdateField = (index, field) => {
    fields.update(index, {
      ...fields.value[index],
      ...field,
    });
  }

  const items = values.slice(0, endOfList);

  return {
    items,
    onAddField,
    onDeleteField,
    onMarkForDeletion,
    onPrependField,
    onReplaceField,
    onUpdateField,
  }
}

export default useKiwtFieldArray;
