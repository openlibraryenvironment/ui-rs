import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';

import { IconButton } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { ChatPane } from './chat';


const useHelperApp = () => {
  const history = useHistory();
  const location = useLocation();
  const { id: requestId } = useParams();

  const query = queryString.parse(location.search);


  const [currentHelper, setCurrentHelper] = useState(query?.helper);

  useEffect(() => {
    if (currentHelper !== query?.helper) {
      const newQuery = {
        ...query,
        helper: currentHelper
      };

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

  const isOpen = (helper) => {
    return currentHelper === helper;
  };

  const HelperComponent = useMemo(() => ((props) => {
    if (!query?.helper) return null;

    let Component = null;

    if (query?.helper === 'tags') Component = Tags;
    if (query?.helper === 'chat') Component = ChatPane;

    if (!Component) return null;

    return (
      <Component
        link={`rs/patronrequests/${requestId}`}
        onToggle={() => handleToggleHelper(query?.helper)}
        {...props}
      />
    );
  }), [handleToggleHelper, requestId, query.helper]);

  const TagButton = ({ request, onClick }) => (
    <FormattedMessage id="ui-rs.view.showTags">
      {ariaLabel => (
        <IconButton
          icon="tag"
          id="clickable-show-tags"
          badgeCount={request?.tags?.length ?? 0}
          onClick={
            () => {
              handleToggleTags();
              onClick({ open: isOpen('tags') });
            }
          }
          ariaLabel={ariaLabel}
        />
      )}
    </FormattedMessage>
  );

  const ChatButton = ({ request, onClick }) => {
    const unseenNotifications = request?.notifications?.filter(notification => notification.seen === false && notification.isSender === false)?.length ?? 0;
    return (
      <FormattedMessage id="ui-rs.view.showChat">
        {ariaLabel => (
          <IconButton
            icon="comment"
            id="clickable-show-chat"
            badgeCount={unseenNotifications}
            onClick={
              () => {
                handleToggleChat();
                onClick({ open: isOpen('chat') });
              }
            }
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
    );
  };


  return { ChatButton, HelperComponent, TagButton };
};

export default useHelperApp;
