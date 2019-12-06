import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, Layout, Pane, Paneset } from '@folio/stripes/components';
import { ActionMessageBanner, ActionMessageProvider } from '../components/Flow/ActionMessage';
import css from './ViewRoute.css';

const subheading = req => {
  const title = _.get(req, 'title');
  if (!title) return undefined;
  const requester = _.get(req, 'resolvedRequester.owner.slug', '');
  if (!requester) return title;
  const supplier = _.get(req, 'resolvedSupplier.owner.slug', '');
  return `${title} · ${requester} → ${supplier}`;

};

const ViewRoute = ({ children, history, resources, location: { pathname }, match: { url, params } }) => (
  <ActionMessageProvider>
    <Paneset>
      <Pane
        paneTitle={`Request ${params.id.replace(/-/g, '·')}`}
        paneSub={subheading(_.get(resources, 'selectedRecord.records[0]'))}
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
            <Button buttonStyle="dropdownItem" to={`../../edit/${params.id}`} id="clickable-edit-patronrequest">
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
        <ActionMessageBanner />
        <div>{children}</div>
      </Pane>
    </Paneset>
  </ActionMessageProvider>
);

ViewRoute.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
    url: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  history: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

ViewRoute.manifest = {
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}', // eslint-disable-line no-template-curly-in-string,
    fetch: false,
  },
};

export default stripesConnect(ViewRoute);
