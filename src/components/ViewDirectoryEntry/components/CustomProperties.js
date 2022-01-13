import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';

import CustomProperty from './CustomProperty';
import css from './CustomProperties.css';

const CustomProperties = ({
  defaultInternal = true,
  id,
  onToggle,
  open,
  record
}) => {
  const custprops = Object.values(record?.customProperties ? record?.customProperties : {})
    .map(cp => (cp?.[0] ? cp?.[0] : {}))
    .filter(cp => cp.type?.defaultInternal === defaultInternal);
  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-directory.information.heading.customProps" />}
      open={open}
      onToggle={onToggle}
    >
      {/* Render custprops in 3 columns */}
      <div
        className={css.flexRowContainer}
      >
        {custprops.map(cp => (
          <div
            className={css.flexRowItem}
          >
            <CustomProperty custprop={cp} />
          </div>
        ))}
      </div>
    </Accordion>
  );
};

CustomProperties.propTypes = {
  defaultInternal: PropTypes.bool,
  record: PropTypes.object,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default CustomProperties;
