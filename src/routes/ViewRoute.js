import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';

import { Tags } from '@folio/stripes-erm-components';

import { ContextualMessageBanner, MessageModalProvider } from '../components/MessageModalState';
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

const handleToggleHelper = (helper, mutator, resources ) => {
  const currentHelper = _.get(resources, 'query.helper', null);
  const nextHelper = currentHelper !== helper ? helper : null;

  mutator.query.update({ helper: nextHelper });
}

const handleToggleTags = (mutator, resources) => {
  handleToggleHelper('tags', mutator, resources);
}

const tagButton = (mutator, resources) => {
  return (
    <PaneMenu>
      {handleToggleTags &&      
      <FormattedMessage id="ui-rs.view.showTags">
        {ariaLabel => (
          <IconButton
            icon="tag"
            id="clickable-show-tags"
            badgeCount={_.get(resources, 'selectedRecord.records[0].tags.length', 0)}
            onClick={
              ()=> { handleToggleTags(mutator, resources)}
            }
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

  if (!HelperComponent) return null;
  return (
    <HelperComponent
      link={`rs/patronrequests/${match.params.id}`}
      onToggle={() => handleToggleHelper(helper, mutator, resources)}
    />
  );
}

const ViewRoute = ({ children, history, resources, location: { pathname }, match, mutator }) => {
  return (
    <MessageModalProvider>
      <Paneset>
        <Pane
          paneTitle={`Request ${match.params.id.replace(/-/g, '·')}`}
          paneSub={subheading(_.get(resources, 'selectedRecord.records[0]'), match.params)}
          padContent={false}
          onClose={() => history.push('../../..')}
          dismissible
          lastMenu={tagButton(mutator, resources)}
          defaultWidth="fill"
          subheader={
            <Layout
              className={`${css.tabContainer} flex centerContent flex-align-items-center full padding-start-gutter padding-end-gutter`}
            >
              <ButtonGroup>
                <Button
                  marginBottom0
                  to={`${match.url}/flow`}
                  buttonStyle={pathname.includes('/flow') ? 'primary' : 'default'}
                  replace
                >
                  <FormattedMessage id="ui-rs.flow.flow" />
                </Button>
                <Button
                  marginBottom0
                  to={`${match.url}/details`}
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
              <Button buttonStyle="dropdownItem" to={`../../edit/${match.params.id}`} id="clickable-edit-patronrequest">
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
          <ContextualMessageBanner />
          <div>{children}</div>
        </Pane>
        {getHelperApp(match, resources, mutator)}
      </Paneset>
    </MessageModalProvider>
  );
};

ViewRoute.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
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
};

ViewRoute.manifest = {
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
    fetch: false,
  },
  tagsValues: {
    type: 'okapi',
    path: 'tags',
    params: {
      limit: '1000',
      query: 'cql.allRecords=1 sortby label',
    },
  },
  query: {},
};

export default stripesConnect(ViewRoute);
