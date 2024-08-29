import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { EditPullslipNotification } from './settings/pullslipNotifications';
import Settings from './settings';
import AppNameContext from './AppNameContext';

import CreateEditRoute from './routes/CreateEditRoute';
import LocalNoteRoute from './routes/LocalNoteRoute';
import PatronRequestsRoute from './routes/PatronRequestsRoute';
import PullSlipRoute from './routes/PullSlipRoute';
import ViewRoute from './routes/ViewRoute';

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
      <Switch>
        <Redirect
          exact
          from={path}
          to={`${path}/requests`}
        />

        {/* Backwards compatibility for previous client-side URLs */}
        <Redirect
          exact
          from={`${path}/requests/view/:id`}
          to={`${path}/requests/:id${search}`}
        />
        <Redirect
          exact
          from={`${path}/requests/view/:id/flow`}
          to={`${path}/requests/:id/flow${search}`}
        />
        <Redirect
          exact
          from={`${path}/requests/view/:id/details`}
          to={`${path}/requests/:id/details${search}`}
        />

        {appName === 'request' &&
          <Route path={`${path}/requests/create`} component={CreateEditRoute} />
        }
        {appName === 'request' &&
          <Route path={`${path}/requests/:id/edit`} component={CreateEditRoute} />
        }
        <Route path={`${path}/requests/:id/localnote`} component={LocalNoteRoute} />
        <Route path={`${path}/requests/:id/pullslip`} component={PullSlipRoute} />
        <Route path={`${path}/requests/batch/:batchId/pullslip`} component={PullSlipRoute} />
        {appName === 'request' &&
          <Route path={`${path}/requests/:id/rerequest`} component={CreateEditRoute} />
        }
        {appName === 'request' &&
          <Route path={`${path}/requests/:id/revalidate`} component={CreateEditRoute} />
        }
        {appName === 'request' &&
          <Route path={`${path}/requests/:id/nrrevalidate`} component={CreateEditRoute} />
        }
        <Redirect
          exact
          from={`${path}/requests/:id`}
          to={`${path}/requests/:id/flow${search}`}
        />

        {/* Contains nested routes: ./details and ./flow */}
        <Route path={`${path}/requests/:id`} component={ViewRoute} />

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
