import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Headline } from '@folio/stripes/components';

const TitleAndSILink = ({ request }) => {
  const stripes = useStripes();
  const inventoryLink = (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${stripes.config.sharedIndexUI}/inventory/view/${request.systemInstanceIdentifier}`}
    >
      <FormattedMessage id="ui-rs.flow.info.viewInSharedIndex" />
    </a>
  );

  return (
    <>
      <Headline margin="none" size="large" tag="h2" weight="regular">
        <strong>{`${request.hrid || request.id}: `}</strong>
        {request.title}
      </Headline>
      {inventoryLink}
    </>
  );
};

TitleAndSILink.propTypes = {
  request: PropTypes.object.isRequired,
};

export default TitleAndSILink;
