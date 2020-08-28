import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Headline, Layout } from '@folio/stripes/components';

import css from './Flow.css';

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
    <Layout className={css.title_headline}>
      <Headline margin="none" size="xx-large" tag="h2" weight="regular">
        <strong>{`${request.hrid || request.id}: `}</strong>
        {request.title}
      </Headline>
      {inventoryLink}
    </Layout>
  );
};

TitleAndSILink.propTypes = {
  request: PropTypes.object.isRequired,
};

export default TitleAndSILink;
