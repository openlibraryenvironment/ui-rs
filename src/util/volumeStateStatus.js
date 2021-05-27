/*
  * This is a function to take in a RequestVolume and determine,
  * from the request state code, whether that volume is in an acceptable state or not
  */
const volumeStateStatus = (vol, code) => {
  if (code === "RES_AWAIT_PICKING" || "RES_AWAIT_PROXY_BORROWER" || "RES_AWAIT_SHIP") {
    // At this point, the ideal scenario is 'Checked in to ReShare'
    return vol.status.value === 'checked_in_to_reshare'
  }
  return false;
};

export default volumeStateStatus;
