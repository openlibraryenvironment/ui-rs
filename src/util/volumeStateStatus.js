/*
  * This is a function to take in a RequestVolume and determine,
  * from the request state code, whether that volume is in an acceptable state or not
  */
const volumeStateStatus = (vol, code) => {
  const volValue = vol.status?.value;
  switch (code) {
    case (code.match(/^RES/) || {}).input:
      // If on the supplier's side, check not in an awaiting state
      return volValue && volValue !== 'awaiting_lms_check_out' && volValue !== 'awaiting_lms_check_in';
    case (code.match(/^REQ/) || {}).input:
      // If on the requester's side, check not awaiting temporary item creation
      return volValue && volValue !== 'awaiting_temporary_item_creation';
    default:
      return false;
  }
};

export default volumeStateStatus;
