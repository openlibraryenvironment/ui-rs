import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { DirectLink } from '@reshare/stripes-reshare';

import { ChatPane } from '../components/chat';
import upNLevels from '../util/upNLevels';
import renderNamedWithProps from '../util/renderNamedWithProps';
import { ContextualMessageBanner, MessageModalProvider, useMessage } from '../components/MessageModalState';
import * as modals from '../components/Flow/modals';
import { actionsForRequest } from '../components/Flow/actionsByState';
import { ActionProvider, ActionContext } from '../components/Flow/ActionContext';
import AppNameContext from '../AppNameContext';
import FlowRoute from './FlowRoute';
import ViewPatronRequest from '../components/ViewPatronRequest';
import ViewMessageBanners from '../components/ViewMessageBanners';
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

const handleToggleHelper = (helper, mutator, resources) => {
  const currentHelper = _.get(resources, 'query.helper', null);
  const nextHelper = currentHelper !== helper ? helper : null;

  mutator.query.update({ helper: nextHelper });
};

const handleToggleTags = (mutator, resources) => {
  handleToggleHelper('tags', mutator, resources);
};

const handleToggleChat = (mutator, resources) => {
  handleToggleHelper('chat', mutator, resources);
};

const paneButtons = (mutator, resources, request) => {
  let listOfUnseenNotifications = request?.notifications;
  listOfUnseenNotifications = listOfUnseenNotifications ? listOfUnseenNotifications.filter(notification => notification.seen === false && notification.isSender === false) : null;
  return (
    <PaneMenu>
      {handleToggleChat && resources?.selectedRecord?.records?.[0]?.resolvedSupplier &&
      <FormattedMessage id="ui-rs.view.showChat">
        {ariaLabel => (
          <IconButton
            icon="comment"
            id="clickable-show-chat"
            badgeCount={listOfUnseenNotifications ? listOfUnseenNotifications.length : 0}
            onClick={() => handleToggleChat(mutator, resources)}
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
      }
      {handleToggleTags &&
      <FormattedMessage id="ui-rs.view.showTags">
        {ariaLabel => (
          <IconButton
            icon="tag"
            id="clickable-show-tags"
            badgeCount={request?.tags?.length ?? 0}
            onClick={() => handleToggleTags(mutator, resources)}
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
      }
    </PaneMenu>
  );
};

const getHelperApp = (match, resources, mutator) => {
  const helper = _.get(resources, 'query.helper', null);
  if (!helper) return null;

  let HelperComponent = null;

  if (helper === 'tags') HelperComponent = Tags;
  if (helper === 'chat') HelperComponent = ChatPane;

  if (!HelperComponent) return null;

  const extraProps = { mutator, resources };
  return (
    <HelperComponent
      link={`rs/patronrequests/${match.params.id}`}
      onToggle={() => handleToggleHelper(helper, mutator, resources)}
      {... extraProps}
    />
  );
};

const ViewRoute = ({ history, resources, location, location: { pathname }, match, mutator, stripes }) => {
  const [, setMessage] = useMessage();
  const [, setActions] = useContext(ActionContext);

  const ky = useOkapiKy();
  const { data: request = {}, isSuccess: hasRequestLoaded, refetch: refetchRequest } = useQuery(
    ['ui-rs', 'viewRoute', 'getSelectedRecord', match.params?.id],
    () => ky(`rs/patronrequests/${match.params?.id}`).json()
  );

  const performAction = (action, payload, successMessage, errorMessage) => {
    setActions({ pending: true });
    return mutator.action.POST({ action, actionParams: payload || {} })
      .then(() => {
        setActions({ pending: false });
        if (successMessage) setMessage(successMessage, 'success');
        else setMessage('ui-rs.actions.generic.success', 'success', { action: `stripes-reshare.actions.${action}` }, ['action']);
        refetchRequest();
      })
      .catch(response => {
        setActions({ pending: false });
        response.json()
          .then((rsp) => {
            if (errorMessage) setMessage(errorMessage, 'error', { errMsg: rsp.message });
            else setMessage('ui-rs.actions.generic.error', 'error', { action: `stripes-reshare.actions.${action}`, errMsg: rsp.message }, ['action']);
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
          lastMenu={paneButtons(mutator, resources)}
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
        {getHelperApp(match, resources, mutator)}
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

ViewRoute.manifest = {
  tagsValues: {
    type: 'okapi',
    path: 'tags',
    params: {
      limit: '1000',
      query: 'cql.allRecords=1 sortby label',
    },
  },
  action: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}/performAction',
    fetch: false,
    clientGeneratePk: false,
    throwErrors: false
  },
  query: {},
};

const ConnectedViewRoute = stripesConnect(ViewRoute);

const ViewRouteWithContext = props => (
  <ActionProvider>
    <MessageModalProvider>
      <ConnectedViewRoute {...props} />
    </MessageModalProvider>
  </ActionProvider>
);

export default ViewRouteWithContext;
