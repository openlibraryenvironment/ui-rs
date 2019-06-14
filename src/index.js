import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import PatronRequests from './routes/PatronRequests';
import Settings from './settings';

class ResourceSharing extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actAs: PropTypes.string.isRequired,

    stripes: PropTypes.shape({
      connect: PropTypes.func,
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

    if (actAs === 'settings') {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Redirect
          exact
          from={path}
          to={`${path}/requests`}
        />
        <Route
          path={`${path}/requests`}
          render={() => <this.connectedPatronRequests {...this.props} />}
        />
      </Switch>
    );
  }
}

export default ResourceSharing;
