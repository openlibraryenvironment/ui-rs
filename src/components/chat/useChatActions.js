import { usePerformAction } from '@reshare/stripes-reshare';

const useChatActions = (reqId) => {
  const performAction = usePerformAction(reqId);

  const handleMarkAllRead = (readStatus, excluding = false) => {
    const success = readStatus ? 'ui-rs.actions.messagesAllSeen.success' : 'ui-rs.actions.messagesAllUnseen.success';
    const error = readStatus ? 'ui-rs.actions.messagesAllSeen.error' : 'ui-rs.actions.messagesAllUnseen.error';
    performAction('messagesAllSeen',
      { seenStatus: readStatus, excludes: excluding },
      { success, error, display: 'none', noAsync: true });
  };

  const handleMessageRead = (notification, currentReadStatus) => {
    const id = notification?.id;

    const success = currentReadStatus ? 'ui-rs.actions.messageSeen.success' : 'ui-rs.actions.messageUnseen.success';
    const error = currentReadStatus ? 'ui-rs.actions.messageSeen.error' : 'ui-rs.actions.messageUnseen.error';

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    performAction('messageSeen', payload, { success, error, display: 'none', noAsync: true });
  };

  return { handleMarkAllRead, handleMessageRead };
};

export default useChatActions;
