export default (props) => {
  const { hasLoaded, other, records } = props.records;

  if (!hasLoaded) {
    return 'Record not yet loaded for printing';
  }

  const totalRecords = other.totalRecords;
  if (records.length < totalRecords) {
    return `Not enough records loaded for printing (${records.length} of ${totalRecords})`;
  }

  // records.record[0]
  return 'printing all pull-slips';
};
