import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { useHelperApp } from '@k-int/stripes-kint-components';

import { IconButton } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { ChatPane } from './chat';


const useRSHelperApp = () => {
  const location = useLocation();
  const { HelperComponent, helperToggleFunctions } = useHelperApp({
    tags: Tags,
    chat: ChatPane
  });

  const { helper: currentHelper } = queryString.parse(location.search);
  const isOpen = (helper) => {
    return currentHelper === helper;
  };

  const TagButton = ({ request, onClick }) => (
    <FormattedMessage id="ui-rs.view.showTags">
      {ariaLabel => (
        <IconButton
          icon="tag"
          id="clickable-show-tags"
          badgeCount={request?.tags?.length ?? 0}
          onClick={
            () => {
              helperToggleFunctions.tags();
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
                helperToggleFunctions.chat();
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

export default useRSHelperApp;
