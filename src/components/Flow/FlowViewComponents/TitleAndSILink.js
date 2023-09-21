import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Headline, Layout } from '@folio/stripes/components';
import { DirectLink, useGetSIURL } from '@reshare/stripes-reshare';

import css from './Flow.css';

const TitleAndSILink = ({ request }) => {
  const getSIURL = useGetSIURL();
  const siURL = getSIURL(request.systemInstanceIdentifier);
  const inventoryLink = siURL ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={siURL}
    >
      <FormattedMessage id="ui-rs.flow.info.viewInSharedIndex" />
    </a>
  ) : null;

  return (
    <Layout className={css.title_headline}>
      <Headline margin="none" size="xx-large" tag="h2" weight="regular">
        <strong>{`${request.hrid || request.id}: `}</strong>
        {request.title}
      </Headline>
      <Layout className={css.title_links}>
        { request.precededBy &&
          <DirectLink to={`../${request.precededBy.id}`} preserveSearch><FormattedMessage id="ui-rs.flow.info.precededByLink" /></DirectLink>
        }
        { request.succeededBy &&
          <DirectLink to={`../${request.succeededBy.id}`} preserveSearch><FormattedMessage id="ui-rs.flow.info.succeededByLink" /></DirectLink>
        }
        {inventoryLink}
      </Layout>
    </Layout>
  );
};

TitleAndSILink.propTypes = {
  request: PropTypes.object.isRequired,
};

export default TitleAndSILink;
