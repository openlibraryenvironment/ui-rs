import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

const AddManualFee = ({ request }) => {
  const barcodeQuery = useOkapiQuery('users', {
    searchParams: `?limit=2&query=barcode%3D${request.patronIdentifier}`,
    staleTime: Infinity,
    enabled: !!request.patronIdentifier
  });
  const patronUUID = barcodeQuery?.data?.users?.[0]?.id;
  return (
    <Button buttonStyle="dropdownItem" to={`/users/${patronUUID}/charge`} disabled={!patronUUID}>
      <Icon icon="plus-sign"><FormattedMessage id="ui-rs.actions.addManualFee" /></Icon>
    </Button>
  );
};

export default AddManualFee;
