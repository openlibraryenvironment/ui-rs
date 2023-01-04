import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import PatronRequestsRoute from './routes/PatronRequestsRoute';
import CreateEditRoute from './routes/CreateEditRoute';
import ViewRoute from './routes/ViewRoute';
import PullSlipRoute from './routes/PullSlipRoute';
import { EditPullslipNotification } from './settings/pullslipNotifications';
import Settings from './settings';
import AppNameContext from './AppNameContext';
import StaleBundleWarning from './components/StaleBundleWarning';

const ResourceSharing = (props) => {
  const {
    actAs,
    match: { path },
    location: { search }
  } = props;

  const appName = path.substring(1).replace(/\/.*/, '');
  props.stripes.logger.log('appName', `us-rs: path='${path}', appName='${appName}'`);

  // stripes-kint-components no longer contains translations for its strings and needs to know where to look
  const addKey = useIntlKeyStore(state => state.addKey);
  addKey('stripes-reshare');

  if (actAs === 'settings') {
    return <Settings {...props} appName={appName} />;
  }

  return (
    <AppNameContext.Provider value={appName}>
      {/* TODO: remove after switching to the Stripes version from the Morning Glory release
      which will include this functionality in core */}
      <StaleBundleWarning />
      <Switch>
        <Redirect
          exact
          from={path}
          to={`${path}/requests`}
        />
        {appName === 'request' &&
          <Route path={`${path}/requests/create`} component={CreateEditRoute} />
        }
        {appName === 'request' &&
          <Route path={`${path}/requests/edit/:id`} component={CreateEditRoute} />
        }
        <Redirect
          exact
          from={`${path}/requests/view/:id`}
          to={`${path}/requests/view/:id/flow${search}`}
        />
        <Route path={`${path}/requests/view/:id/pullslip`} component={PullSlipRoute} />

        {/* Contains nested routes: ./details and ./flow */}
        <Route path={`${path}/requests/view/:id`} component={ViewRoute} />

        <Route
          path={`${path}/requests/:action?`}
          render={(p) => <PatronRequestsRoute {...p} appName={appName} />}
        />
        <Route path={`${path}/pullslip-notifications/:id/edit`} component={EditPullslipNotification} />
      </Switch>
    </AppNameContext.Provider>
  );
};

export default ResourceSharing;
