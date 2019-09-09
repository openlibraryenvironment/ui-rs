import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, Layout, Pane, Paneset } from '@folio/stripes/components';
import css from './ViewRoute.css';

export default ({ children, history, location: { pathname }, match: { url } }) => (
  <React.Fragment>
    <Paneset>
      <Pane
        paneTitle="Request"
        padContent={false}
        onClose={history.goBack}
        dismissible
        defaultWidth="fill"
        subheader={
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
        }
      >
        {children}
      </Pane>
    </Paneset>
  </React.Fragment>
);
