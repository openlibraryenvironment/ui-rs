/*
  * This is a function to take in a RequestVolume and determine,
  * from the request state code, whether that volume is in an acceptable state or not
  */
const volumeStateStatus = (vol, code) => {
  switch (code) {
    case (code.match(/^RES/) || {}).input:
      const volValue = vol.status?.value
      // If on the supplier's side, check not in an awaiting state
      return volValue === 'lms_check_out_complete' || volValue === 'completed';
    case (code.match(/^REQ/) || {}).input:
      // If on the requester's side, just need to know if temp item created or not
      return vol.status?.value === 'temporary_item_created_in_host_lms'
    default:
      return false;
  }
};

export default volumeStateStatus;
