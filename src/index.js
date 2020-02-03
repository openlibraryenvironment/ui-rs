import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import PatronRequestsRoute from './routes/PatronRequestsRoute';
import CreateEditRoute from './routes/CreateEditRoute';
import ViewRoute from './routes/ViewRoute';
import PullSlipRoute from './routes/PullSlipRoute';
import Settings from './settings';
import AppNameContext from './AppNameContext';
import { MessageModalProvider } from './components/MessageModalState';

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
        <MessageModalProvider>
          <Switch>
            <Redirect
              exact
              from={path}
              to={`${path}/requests`}
            />
            <Route path={`${path}/requests/create`} component={CreateEditRoute} />
            <Route path={`${path}/requests/edit/:id`} component={CreateEditRoute} />
            <Redirect
              exact
              from={`${path}/requests/view/:id`}
              to={`${path}/requests/view/:id/details${search}`}
            />
            <Route path={`${path}/requests/view/:id/pullslip`} component={PullSlipRoute} />

            {/* Contains nested routes: ./details and ./flow */}
            <Route path={`${path}/requests/view/:id`} component={ViewRoute} />

            <Route
              path={`${path}/requests/:action?`}
              render={(props) => <PatronRequestsRoute {...props} appName={appName} />}
            />
          </Switch>
        </MessageModalProvider>
      </AppNameContext.Provider>
    );
  }
}

export default ResourceSharing;
