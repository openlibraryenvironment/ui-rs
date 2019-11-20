import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, Icon, Layout, Pane, Paneset } from '@folio/stripes/components';
import css from './ViewRoute.css';

const ViewRoute = ({ children, history, location: { pathname }, match: { url, params } }) => (
  <React.Fragment>
    <Paneset>
      <Pane
        paneTitle={`Request ${params.id}`}
        padContent={false}
        onClose={history.goBack}
        dismissible
        defaultWidth="fill"
        subheader={
          <Layout
            className={`${css.tabContainer} flex centerContent flex-align-items-center full padding-start-gutter padding-end-gutter`}
          >
            <ButtonGroup>
              <Button
                marginBottom0
                to={`${url}/flow`}
                buttonStyle={pathname.includes('/flow') ? 'primary' : 'default'}
                replace
              >
                <FormattedMessage id="ui-rs.flow.flow" />
              </Button>
              <Button
                marginBottom0
                to={`${url}/details`}
                buttonStyle={pathname.includes('/details') ? 'primary' : 'default'}
                replace
              >
                <FormattedMessage id="ui-rs.flow.details" />
              </Button>
            </ButtonGroup>
          </Layout>
        }
        actionMenu={() => (
          <React.Fragment>
            <Button buttonStyle="dropdownItem" to={`../../requests/edit/${params.id}`} id="clickable-edit-patronrequest">
              <Icon icon="edit">
                <FormattedMessage id="ui-rs.edit" />
              </Icon>
            </Button>
            <Button buttonStyle="dropdownItem" to="pullslip" id="clickable-pullslip">
              <Icon icon="print">
                <FormattedMessage id="ui-rs.printPullslip" />
              </Icon>
            </Button>
          </React.Fragment>
        )}
      >
        {children}
      </Pane>
    </Paneset>
  </React.Fragment>
);

ViewRoute.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
    url: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  history: PropTypes.object.isRequired,
};

export default ViewRoute;
