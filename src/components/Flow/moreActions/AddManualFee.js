import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Button, Icon } from '@folio/stripes/components';

const AddManualFee = ({ request }) => {
  const stripes = useStripes();
  const patronURL = stripes?.config?.reshare?.patronURL?.replace('{patronid}', request.patronIdentifier);
  return (
    <Button buttonStyle="dropdownItem" to={patronURL}>
      <Icon icon="plus-sign"><FormattedMessage id="ui-rs.actions.addManualFee" /></Icon>
    </Button>
  );
};

export default AddManualFee;
