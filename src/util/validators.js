import React from 'react';
import { FormattedMessage } from 'react-intl';

const required = value => (
  !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
);

export {
  required, // eslint-disable-line import/prefer-default-export
};
