// As per my discussion with @nielserik on Monday 9 December 2019,
// these specific UUIDs are hardwired parts of the mod-inventory API,
// and can never changes without a major release.
//
// These definitions should really be provided by ui-inventory (or
// ideally mod-inventory), but since they don't seem to do, I define
// them here.

const isbnTypeId = '8261054f-be78-422d-bd51-4ed9f33c3422';
const issnTypeId = '913300b2-03ed-469a-8179-c1092c991227';
export { isbnTypeId, issnTypeId };
