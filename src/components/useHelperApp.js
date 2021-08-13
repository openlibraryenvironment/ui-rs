import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { IconButton } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { ChatPane } from './chat';


const useHelperApp = () => {
  const history = useHistory();
  const location = useLocation();

  const query = queryString.parse(location.search);


  const [currentHelper, setCurrentHelper] = useState(query?.helper);

  useEffect(() => {
    if (currentHelper !== query?.helper) {
      const { helper: _p, ...rest } = query;
      let newQuery = {};
      if (currentHelper) {
        newQuery = {
          ...rest,
          helper: currentHelper
        };
      } else {
        newQuery = { ...rest };
      }

      history.push({
        pathname: location.pathname,
        search: `?${queryString.stringify(newQuery)}`
      });
    }
  }, [currentHelper, history, location, query]);

  const handleToggleHelper = useCallback((helper) => {
    setCurrentHelper(helper !== currentHelper ? helper : undefined);
  }, [currentHelper]);

  const handleToggleTags = () => {
    handleToggleHelper('tags');
  };

  const handleToggleChat = () => {
    handleToggleHelper('chat');
  };


  const HelperComponent = useMemo(() => ((props) => {
    if (!query?.helper) return null;

    let Component = null;

    if (query?.helper === 'tags') Component = Tags;
    if (query?.helper === 'chat') Component = ChatPane;

    if (!Component) return null;

    return (
      <Component
        onToggle={() => handleToggleHelper(query?.helper)}
        {...props}
      />
    );
  }), [handleToggleHelper, query.helper]);

  const TagButton = ({ request }) => (
    <FormattedMessage id="ui-rs.view.showTags">
      {ariaLabel => (
        <IconButton
          icon="tag"
          id="clickable-show-tags"
          badgeCount={request?.tags?.length ?? 0}
          onClick={() => handleToggleTags()}
          ariaLabel={ariaLabel}
        />
      )}
    </FormattedMessage>
  );

  const ChatButton = ({ request }) => {
    const unseenNotifications = request?.notifications?.filter(notification => notification.seen === false && notification.isSender === false)?.length ?? 0;
    return (
      <FormattedMessage id="ui-rs.view.showChat">
        {ariaLabel => (
          <IconButton
            icon="comment"
            id="clickable-show-chat"
            badgeCount={unseenNotifications}
            onClick={() => handleToggleChat()}
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
    );
  };


  return { ChatButton, HelperComponent, TagButton };
};

export default useHelperApp;
