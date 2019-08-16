import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, Layout } from '@folio/stripes/components';

export default ({ children, location: { pathname }, match: { url } }) => (
  <React.Fragment>
    <Layout className="flex centerContent full">
      <ButtonGroup>
        <Button to={`${url}/flow`} buttonStyle={pathname.includes('/flow') ? 'primary' : 'default'}>
          <FormattedMessage id="ui-rs.flow.flow" />
        </Button>
        <Button to={`${url}/details`} buttonStyle={pathname.includes('/details') ? 'primary' : 'default'}>
          <FormattedMessage id="ui-rs.flow.details" />
        </Button>
      </ButtonGroup>
    </Layout>
    {children}
  </React.Fragment>
);
