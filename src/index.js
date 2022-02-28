import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import PatronRequestsRoute from './routes/PatronRequestsRoute';
import CreateEditRoute from './routes/CreateEditRoute';
import ViewRoute from './routes/ViewRoute';
import PullSlipRoute from './routes/PullSlipRoute';
import { EditPullslipNotification } from './settings/pullslipNotifications';
import Settings from './settings';
import AppNameContext from './AppNameContext';
import StaleBundleWarning from './components/StaleBundleWarning';

class ResourceSharing extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    actAs: PropTypes.string.isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func,
      }),
    }),
  };

  render() {
    const {
      actAs,
      match: { path },
      location: { search }
    } = this.props;

    const appName = path.substring(1).replace(/\/.*/, '');
    this.props.stripes.logger.log('appName', `us-rs: path='${path}', appName='${appName}'`);

    if (actAs === 'settings') {
      return <Settings {...this.props} appName={appName} />;
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
            render={(props) => <PatronRequestsRoute {...props} appName={appName} />}
          />
          <Route path={`${path}/pullslip-notifications/:id/edit`} component={EditPullslipNotification} />
        </Switch>
      </AppNameContext.Provider>
    );
  }
}

export default ResourceSharing;
