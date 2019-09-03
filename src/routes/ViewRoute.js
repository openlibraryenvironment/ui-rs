import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, Layout } from '@folio/stripes/components';
import css from './ViewRoute.css';

export default ({ children, location: { pathname }, match: { url } }) => (
  <React.Fragment>
    <Layout className={`${css.tabContainer} flex centerContent flex-align-items-center full padding-start-gutter padding-end-gutter`}>
      <ButtonGroup>
        <Button marginBottom0 to={`${url}/flow`} buttonStyle={pathname.includes('/flow') ? 'primary' : 'default'}>
          <FormattedMessage id="ui-rs.flow.flow" />
        </Button>
        <Button marginBottom0 to={`${url}/details`} buttonStyle={pathname.includes('/details') ? 'primary' : 'default'}>
          <FormattedMessage id="ui-rs.flow.details" />
        </Button>
      </ButtonGroup>
    </Layout>
    {children}
  </React.Fragment>
);
