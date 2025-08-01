import React, { useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { useStripes } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, Layout, Pane, PaneMenu, Paneset, Tooltip } from '@folio/stripes/components';
import { DirectLink, upNLevels, useCloseDirect, usePerformAction, useOkapiQuery } from '@projectreshare/stripes-reshare';

import renderNamedWithProps from '../util/renderNamedWithProps';
import { MessageModalProvider } from '../components/MessageModalState';
import * as modals from '../components/Flow/modals';
import { useActionsForRequest, excludeRemote } from '../components/Flow/actionsByState';
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
  const close = useCloseDirect(upNLevels(location, 2));

  // Set an access cookie to use with the broker link
  document.cookie = `folioAccessToken=${stripes?.okapi.token}; path=/broker; secure; SameSite=Lax`;

  const { data: request, isSuccess: hasRequestLoaded } = useOkapiQuery(`rs/patronrequests/${id}`, { parseResponse: false, staleTime: 2 * 60 * 1000, notifyOnChangeProps: 'tracked' });
  const forCurrent = useActionsForRequest(request);

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
        {request?.supplyingInstitutionSymbol &&
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
        {request?.localNote &&
          <Tooltip
            id="rs-local-note-tooltip"
            text={<FormattedMessage id="stripes-reshare.hasLocalNote" />}
          >
            {({ ref, ariaIds }) => (
              <Icon
                icon="report"
                aria-labelledby={ariaIds.text}
                ref={ref}
              />
            )}
          </Tooltip>
        }
        {request?.patronNote &&
          <Tooltip
            id="rs-patron-note-tooltip"
            text={<FormattedMessage id="stripes-reshare.hasPatronNote" />}
          >
            {({ ref, ariaIds }) => (
              <Icon
                icon="profile"
                aria-labelledby={ariaIds.text}
                ref={ref}
              />
            )}
          </Tooltip>
        }
      </PaneMenu>
    );
  };


  if (!hasRequestLoaded || forCurrent === null) return null;

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
                  <DirectLink component={Button} buttonStyle="dropdownItem" to="edit" id="clickable-edit-patronrequest">
                    <Icon icon="edit">
                      <FormattedMessage id="ui-rs.edit" />
                    </Icon>
                  </DirectLink>
                )
              }
              {request?.validActions?.some(a => a.actionCode === 'localNote') &&
                <DirectLink component={Button} buttonStyle="dropdownItem" to="localNote" id="clickable-localnote">
                  <Icon icon="edit">
                    <FormattedMessage id="stripes-reshare.actions.localNote" />
                  </Icon>
                </DirectLink>
              }
              {request?.validActions?.some(a => a.actionCode === 'manualClose') &&
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
