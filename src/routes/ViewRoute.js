import React, { useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';
import { upNLevels, useCloseDirect, usePerformAction, useOkapiQuery } from '@projectreshare/stripes-reshare';

import renderNamedWithProps from '../util/renderNamedWithProps';
import { MessageModalProvider } from '../components/MessageModalState';
import * as modals from '../components/Flow/modals';
import { actionsForRequest, excludeRemote } from '../components/Flow/actionsByState';
import { ManualClose, PrintPullSlip } from '../components/Flow/moreActions';
import AppNameContext from '../AppNameContext';
import FlowRoute from './FlowRoute';
import ViewPatronRequest from '../components/ViewPatronRequest';
import ViewMessageBanners from '../components/ViewMessageBanners';
import useRSHelperApp from '../components/useRSHelperApp';
import useChatActions from '../components/chat/useChatActions';

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

const ViewRoute = ({ location, location: { pathname }, match }) => {
  const id = match.params?.id;
  const intl = useIntl();
  const stripes = useStripes();
  const { ChatButton, HelperComponent, TagButton, isOpen } = useRSHelperApp();
  const appName = useContext(AppNameContext);
  const performAction = usePerformAction(id);
  const { handleMarkAllRead } = useChatActions(id);
  const close = useCloseDirect(upNLevels(location, 3));

  // Fetch the request
  const { data: request = {}, isSuccess: hasRequestLoaded } = useOkapiQuery(`rs/patronrequests/${id}`, { staleTime: 2 * 60 * 1000, notifyOnChangeProps: 'tracked' });

  // Fetch Auto Responder
  const { data: autoRespondRequest = {}, isSuccess: autoRespondLoaded } = useOkapiQuery('rs/settings/appSettings', {
    searchParams: {
      filters: 'section==autoResponder',
      perPage: '100',
      staleTime: 2 * 60 * 60 * 1000
    }
  });

  /* On mount ONLY we want to check if the helper is open, and if so then mark all messages as read.
   * If this useEffect is handed dependencies handleMarkAllRead and isOpen then it will infinitely loop,
   */

  // This could maybe be solved by memoizing isOpen within useHelperApp?

  useEffect(() => {
    if (isOpen('chat')) {
      handleMarkAllRead(true, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paneButtons = () => {
    return (
      <PaneMenu>
        {request?.resolvedSupplier &&
          <ChatButton
            request={request}
            onClick={({ open }) => {
              // This case handles the marking of messages as read when the chat pane opens for the first time within the view
              if (!open) {
                handleMarkAllRead(true, true);
              }
            }}
          />
        }
        <TagButton request={request} />
      </PaneMenu>
    );
  };


  if (!hasRequestLoaded && !autoRespondLoaded) return null;
  const autoLoanOff = autoRespondRequest.some(item => item.key === 'auto_responder_status' && (item.value && item.value === 'off'));
  const forCurrent = actionsForRequest(request, autoLoanOff);

  return (
    <>
      <Paneset>
        <Pane
          centerContent
          paneTitle={intl.formatMessage({ id: 'ui-rs.view.title' }, { id: request.hrid })}
          paneSub={subheading(request, match.params)}
          padContent={false}
          onClose={close}
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
              {request?.validActions?.includes('manualClose') &&
                <ManualClose />
              }
              <PrintPullSlip />
            </>
          )}
        >
          <ViewMessageBanners request={request} />
          <Switch>
            <Route path={`${match.path}/details`} render={() => <ViewPatronRequest record={request} />} />
            <Route path={`${match.path}/flow`} render={() => <FlowRoute request={request} performAction={performAction} />} />
          </Switch>
        </Pane>
        <HelperComponent request={request} isOpen={isOpen} />
      </Paneset>
      {/* Render modals that correspond to available actions, adding back excluded actions */}
      {renderNamedWithProps(
        forCurrent.primaryAction && !forCurrent.moreActions.includes(forCurrent.primaryAction)
          ? [forCurrent.primaryAction, ...forCurrent.moreActions, ...excludeRemote]
          : [...forCurrent.moreActions, ...excludeRemote],
        modals,
        { request, performAction }
      )}
    </>
  );
};

const ViewRouteWithContext = props => (
  <MessageModalProvider>
    <ViewRoute {...props} />
  </MessageModalProvider>
);

export default ViewRouteWithContext;
