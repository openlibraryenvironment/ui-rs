import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Route as NestedRoute } from '@folio/stripes/core';
import PatronRequests from './routes/PatronRequests';
import CreateEditRoute from './routes/CreateEditRoute';
import ViewRoute from './routes/ViewRoute';
import DetailsRoute from './routes/DetailsRoute';
import FlowRoute from './routes/FlowRoute';
import PullSlipRoute from './routes/PullSlipRoute';
import Settings from './settings';
import AppNameContext from './AppNameContext';

class ResourceSharing extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actAs: PropTypes.string.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
      logger: PropTypes.shape({
        log: PropTypes.func,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.connectedPatronRequests = props.stripes.connect(PatronRequests);
  }

  render() {
    const {
      actAs,
      match: {
        path
      }
    } = this.props;

    const appName = path.substring(1).replace(/\/.*/, '');
    this.props.stripes.logger.log('appName', `us-rs: path='${path}', appName='${appName}'`);

    if (actAs === 'settings') {
      return <Settings {...this.props} appName={appName} />;
    }
    return (
      <AppNameContext.Provider value={appName}>
        <Switch>
          <Redirect
            exact
            from={path}
            to={`${path}/requests`}
          />
          <Route path={`${path}/requests/create`} component={CreateEditRoute} />
          <Route path={`${path}/requests/edit/:id`} component={CreateEditRoute} />
          <Route
            path={`${path}/requests`}
            render={() => <this.connectedPatronRequests {...this.props} appName={appName} />}
          />
          <Route path={`${path}/view/:id/pullslip`} component={PullSlipRoute} />
          <NestedRoute path={`${path}/view/:id`} component={ViewRoute}>
            <NestedRoute path={`${path}/view/:id/details`} component={DetailsRoute} />
            <NestedRoute path={`${path}/view/:id/flow`} component={FlowRoute} />
          </NestedRoute>
        </Switch>
      </AppNameContext.Provider>
    );
  }
}

export default ResourceSharing;
