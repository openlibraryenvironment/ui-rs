import React from 'react';
import { useIntl } from 'react-intl';

import tokens from './tokens';
import TokensList from './TokensList';

import Templates from '../templates';

const PullslipTemplates = () => {
  const intl = useIntl();
  return (
    <Templates
      context="pullslipTemplate"
      permissions={{
        put: 'ui-rs.settings.pullslip-notifications',
        post: 'ui-rs.settings.pullslip-notifications',
        delete: 'ui-rs.settings.pullslip-notifications',
      }}
      templateContextLabel={intl.formatMessage({id: 'ui-rs.settings.templates.pullslipTemplate'})?.toLowerCase()}
      tokens={tokens}
      tokensList={TokensList}
    />
  );
};

export default PullslipTemplates;
