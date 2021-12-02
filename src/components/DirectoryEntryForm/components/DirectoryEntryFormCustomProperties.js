import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';

import {
  Accordion,
} from '@folio/stripes/components';

import CustomPropertiesListField from './CustomPropertiesListField';

const DirectoryEntryFormCustomProperties = ({
  parentResources: {
    custprops,
    id,
    onToggle,
    open,
    typeValues
  },
  tab = 'shared'
}) => {
  const intl = useIntl();

  const custProps = custprops.map((cp) => {
    let options = get(cp.category, ['values']);
    if (options) {
      options = [{
        label: intl.formatMessage({ id: 'ui-directory.notSet' }),
        value: '',
      },
      ...options];
    }

    return {
      description: cp.description,
      label: cp.label,
      primary: cp.primary,
      type: cp.type,
      options,
      value: cp.name,
      defaultInternal: cp.defaultInternal,
    };
  });

  const getTypeValues = () => {
    return typeValues?.records?.map(({ id: theId, label }) => ({ label, value: theId }));
  };

  const label = tab === 'shared' ?
    <FormattedMessage id="ui-directory.information.heading.customProps" /> :
    <FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />;

  return (
    <Accordion
      id={id}
      label={label}
      open={open}
      onToggle={onToggle}
    >
      <>
        <Field
          name="customProperties"
          render={props => {
            return (
              <CustomPropertiesListField
                tab={tab}
                availableCustProps={custProps}
                {...props}
              />
            );
          }}
        />
      </>
    </Accordion>
  );
};

DirectoryEntryFormCustomProperties.propTypes = {
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  parentResources: PropTypes.shape({
    typeValues: PropTypes.object,
    selectedRecord: PropTypes.shape({
      records: PropTypes.array
    }),
    custprops: PropTypes.array,
  }),
};

export default DirectoryEntryFormCustomProperties;
