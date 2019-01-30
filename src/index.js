import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import PatronRequests from './routes/patron-requests';
import Settings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Rs extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    // console.log('Attempt to connect %o',PatronRequests);
    this.connectedPatronRequests = props.stripes.connect(PatronRequests);
    // console.log('Connected %o',PatronRequests);
  }

  render() {
    const { stripes, match } = this.props;

    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route
          path={`${match.path}/requests`}
          render={() => <this.connectedPatronRequests stripes={stripes} />}
        />
        <Redirect
          exact
          from={`${match.path}`}
          to={`${match.path}/requests`}
        />
      </Switch>
    );
  }
}

export default Rs;
