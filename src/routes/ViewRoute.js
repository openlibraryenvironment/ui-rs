import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import compose from 'compose-function';
import _ from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { Button, ButtonGroup, Icon, IconButton, Layout, Pane, PaneMenu, Paneset } from '@folio/stripes/components';

import { withTags } from '@folio/stripes/smart-components';
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

const tagButton = (tags, setTags, tagLength) => {
  return(
    <PaneMenu>
      <FormattedMessage id="ui-rs.view.showTags">
        {ariaLabel => (
          <IconButton
            icon="tag"
            id="clickable-show-tags"
            badgeCount={tagLength}
            onClick={
              ()=> {
                //window.alert('This will open the tags pane')
                tags = setTags(!tags)
              }
            }
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );
};


const ViewRoute = ({ children, history, resources, location: { pathname }, match: { url, params }, mutator }) => {
  const [tags, setTags] = useState(false);
  //tagLength = _.get(selectedRecord, 'tags.length', 0);
  return (
    <MessageModalProvider>
      <Paneset>
        <Pane
          paneTitle={`Request ${params.id.replace(/-/g, '·')}`}
          paneSub={subheading(_.get(resources, 'selectedRecord.records[0]'), params)}
          padContent={false}
          onClose={() => history.push('../../..')}
          dismissible
          lastMenu={tagButton(tags, setTags, 0)}
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
          <ContextualMessageBanner />
          <div>{children}</div>
        </Pane>

        {tags &&
          <Tags
            mutator={mutator}
            resources={resources}
          />
        } 

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
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
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
  }

};

export default compose(
  stripesConnect,
  withTags,
)(ViewRoute);
