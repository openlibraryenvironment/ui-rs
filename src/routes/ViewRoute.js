import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';

import { stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { useMutation, useQuery } from 'react-query';

import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { DirectLink } from '@reshare/stripes-reshare';

import { ChatPane } from '../components/chat';
import upNLevels from '../util/upNLevels';
import renderNamedWithProps from '../util/renderNamedWithProps';
import { ContextualMessageBanner, MessageModalProvider, useMessage, useRSCallout } from '../components/MessageModalState';
import * as modals from '../components/Flow/modals';
import { actionsForRequest } from '../components/Flow/actionsByState';
import { ActionProvider, ActionContext } from '../components/Flow/ActionContext';
import AppNameContext from '../AppNameContext';
import FlowRoute from './FlowRoute';
import ViewPatronRequest from '../components/ViewPatronRequest';
import ViewMessageBanners from '../components/ViewMessageBanners';
import useHelperApp from '../components/useHelperApp';

import css from './ViewRoute.css';

const subheading = (req, params) => {
  if (!req || params.id !== req.id) return undefined;
  const title = _.get(req, 'title');
  if (!title) return undefined;
  const requester = _.get(req, 'resolvedRequester.owner.slug', '');
  if (!requester) return title;
  const supplier = _.get(req, 'resolvedSupplier.owner.slug', '');
  return `${title} · ${requester} → ${supplier}`;
};



const ViewRoute = ({ history, location, location: { pathname }, match }) => {
  const stripes = useStripes();
  const [, setMessage] = useMessage();
  const [, setActions] = useContext(ActionContext);
  const sendCallout = useRSCallout();
  const { ChatButton, HelperComponent, TagButton } = useHelperApp();

  const ky = useOkapiKy();
  // Fetch the request
  const { data: request = {}, isSuccess: hasRequestLoaded, refetch: refetchRequest } = useQuery(
    ['ui-rs', 'viewRoute', 'getSelectedRecord', match.params?.id],
    () => ky(`rs/patronrequests/${match.params?.id}`).json()
  );

  // POSTing an action
  const { mutateAsync: postAction } = useMutation(
    ['ui-rs', 'viewRoute', 'postAction'],
    (data) => ky.post(`rs/patronrequests/${match.params?.id}/performAction`, { json: data })
  );

  const paneButtons = () => {
    return (
      <PaneMenu>
        {request?.resolvedSupplier &&
          <ChatButton request={request} />
        }
        <TagButton request={request} />
      </PaneMenu>
    );
  };

  // For now we can control whether we use callout or messageBanner with this final boolean.
  const performAction = (action, payload, successMessage, errorMessage, displayMethod = 'banner') => {
    setActions({ pending: true });

    let displayFunc;
    switch (displayMethod) {
      case 'callout':
        displayFunc = sendCallout;
        break;
      case 'banner':
        displayFunc = setMessage;
        break;
      default:
        // If anything else is passed in here, default to not displaying outcome of action
        displayFunc = () => null;
        break;
    }

    return postAction({ action, actionParams: payload || {} })
      .then(() => {
        setActions({ pending: false });
        if (successMessage) {
          displayFunc(successMessage, 'success');
        } else {
          displayFunc('ui-rs.actions.generic.success', 'success', { action: `stripes-reshare.actions.${action}` }, ['action']);
        }
        refetchRequest();
      })
      .catch(response => {
        setActions({ pending: false });
        response.json()
          .then((rsp) => {
            if (errorMessage) displayFunc(errorMessage, 'error', { errMsg: rsp.message });
            else displayFunc('ui-rs.actions.generic.error', 'error', { action: `stripes-reshare.actions.${action}`, errMsg: rsp.message }, ['action']);
          });
        refetchRequest();
      });
  };


  if (!hasRequestLoaded) return null;
  const forCurrent = actionsForRequest(request);

  return (
    <>
      <Paneset>
        {/* TODO: The "Request" string is translated as ui-rs.view.title which we can use conveniently with a hook once react-intl is upgraded */}
        <Pane
          centerContent
          paneTitle={`Request ${request.hrid}`}
          paneSub={subheading(request, match.params)}
          padContent={false}
          onClose={() => history.push(upNLevels(location, 3))}
          dismissible
          lastMenu={paneButtons()}
          defaultWidth="fill"
          subheader={
            <Layout
              className={`${css.tabContainer} flex centerContent flex-align-items-center full padding-start-gutter padding-end-gutter`}
            >
              <ButtonGroup>
                <Button
                  marginBottom0
                  to={`${match.url}/flow${location.search}`}
                  buttonStyle={pathname.includes('/flow') ? 'primary' : 'default'}
                  replace
                >
                  <FormattedMessage id="ui-rs.flow.flow" />
                </Button>
                <Button
                  marginBottom0
                  to={`${match.url}/details${location.search}`}
                  buttonStyle={pathname.includes('/details') ? 'primary' : 'default'}
                  replace
                >
                  <FormattedMessage id="ui-rs.flow.details" />
                </Button>
              </ButtonGroup>
            </Layout>
          }
          actionMenu={() => (
            <AppNameContext.Consumer>
              {appName => (
                <>
                  {
                    appName === 'request' && stripes.hasPerm(`ui-${appName}.edit`) && (
                      <Button buttonStyle="dropdownItem" to={`../../edit/${match.params.id}`} id="clickable-edit-patronrequest">
                        <Icon icon="edit">
                          <FormattedMessage id="ui-rs.edit" />
                        </Icon>
                      </Button>
                    )
                  }
                  <DirectLink component={Button} buttonStyle="dropdownItem" to={{ pathname: 'pullslip', search: location.search }} id="clickable-pullslip">
                    <Icon icon="print">
                      <FormattedMessage id="ui-rs.printPullslip" />
                    </Icon>
                  </DirectLink>
                </>
              )
              }
            </AppNameContext.Consumer>
          )}
        >
          {/*
            * ContextualMessageBanner is for any contextual messages that are dismissible -- one at a time
            * Any messages which are either dismissible OR not, and need to stack use ViewMessageBanners
            */}
          <ViewMessageBanners request={request} />
          <ContextualMessageBanner />
          <Switch>
            <Route path={`${match.path}/details`} render={() => <ViewPatronRequest record={request} />} />
            <Route path={`${match.path}/flow`} render={() => <FlowRoute request={request} performAction={performAction} />} />
          </Switch>
        </Pane>
        <HelperComponent request={request} performAction={performAction} />
      </Paneset>
      {/* Render modals that correspond to available actions */}
      {renderNamedWithProps(
        forCurrent.primaryAction && !forCurrent.moreActions.includes(forCurrent.primaryAction)
          ? [forCurrent.primaryAction, ...forCurrent.moreActions]
          : forCurrent.moreActions,
        modals,
        { request, performAction }
      )}
    </>
  );
};

ViewRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
    url: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

const ConnectedViewRoute = ViewRoute;

const ViewRouteWithContext = props => (
  <ActionProvider>
    <MessageModalProvider>
      <ConnectedViewRoute {...props} />
    </MessageModalProvider>
  </ActionProvider>
);

export default ViewRouteWithContext;
