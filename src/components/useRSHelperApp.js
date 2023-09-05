import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useHelperApp } from '@k-int/stripes-kint-components';

import { IconButton, Tooltip } from '@folio/stripes/components';
import { Tags } from '@folio/stripes-erm-components';
import { ChatPane } from './chat';


const useRSHelperApp = () => {
  const { HelperComponent, helperToggleFunctions, isOpen } = useHelperApp({
    tags: Tags,
    chat: ChatPane
  });

  const TagButton = ({ request, onClick = () => null }) => (
    <Tooltip
      id="rs-chat-tooltip"
      text={<FormattedMessage id="ui-rs.view.showTags" />}
    >
      {({ ref, ariaIds }) => (
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
          aria-labelledby={ariaIds.text}
          ref={ref}
        />
      )}
    </Tooltip>
  );

  const ChatButton = ({ request, onClick = () => null }) => {
    const unseenNotifications = request?.notifications?.filter(notification => notification.seen === false && notification.isSender === false)?.length ?? 0;
    return (
      <Tooltip
        id="rs-chat-tooltip"
        text={<FormattedMessage id="ui-rs.view.showChat" />}
      >
        {({ ref, ariaIds }) => (
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
            aria-labelledby={ariaIds.text}
            ref={ref}
          />
        )}
      </Tooltip>
    );
  };

  return { ChatButton, HelperComponent, TagButton, isOpen };
};

export default useRSHelperApp;
