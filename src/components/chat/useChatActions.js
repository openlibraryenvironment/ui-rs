
// This doesn't really need to be a hook, but we could eventually try to untangle performAction
// into a neat hook and then this would be perfectly placed to utilise that.
const useChatActions = (performAction) => {
  const handleMarkAllRead = (readStatus, excluding = false) => {
    const successKey = readStatus ? 'ui-rs.actions.messagesAllSeen.success' : 'ui-rs.actions.messagesAllUnseen.success';
    const errorKey = readStatus ? 'ui-rs.actions.messagesAllSeen.error' : 'ui-rs.actions.messagesAllUnseen.error';
    performAction('messagesAllSeen', { seenStatus: readStatus, excludes: excluding }, successKey, errorKey, 'none');
  };

  const handleMessageRead = (notification, currentReadStatus) => {
    const id = notification?.id;

    const successKey = currentReadStatus ? 'ui-rs.actions.messageSeen.success' : 'ui-rs.actions.messageUnseen.success';
    const errorKey = currentReadStatus ? 'ui-rs.actions.messageSeen.error' : 'ui-rs.actions.messageUnseen.error';

    const payload = { id, seenStatus: false };
    if (!currentReadStatus) {
      payload.seenStatus = true;
    }
    performAction('messageSeen', payload, successKey, errorKey, 'none');
  };

  return { handleMarkAllRead, handleMessageRead };
};

export default useChatActions;
