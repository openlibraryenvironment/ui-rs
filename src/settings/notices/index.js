import React from 'react';
import { useIntl } from 'react-intl';

import tokens from './tokens';
import TokensList from './TokensList';

import Templates from '../templates';

const Notices = () => {
  const intl = useIntl();
  return (
    <Templates
      context="noticeTemplate"
      permissions={{
        put: 'ui-rs.settings.notices',
        post: 'ui-rs.settings.notices',
        delete: 'ui-rs.settings.notices',
      }}
      templateContextLabel={intl.formatMessage({id: 'ui-rs.settings.templates.noticeTemplate'})?.toLowerCase()}
      tokens={tokens}
      tokensList={TokensList}
    />
  );
};

export default Notices;
