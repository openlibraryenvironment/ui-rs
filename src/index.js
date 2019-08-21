import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import PatronRequests from './routes/PatronRequests';
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
          <Route
            path={`${path}/requests`}
            render={() => <this.connectedPatronRequests {...this.props} appName={appName} />}
          />
        </Switch>
      </AppNameContext.Provider>
    );
  }
}

export default ResourceSharing;
