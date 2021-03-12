import React from 'react';
import PropTypes from 'prop-types';

import { TokensSection } from '@folio/stripes-template-editor';

const TokensList = ({ tokens, onSectionInit, onTokenSelect }) => (
  <TokensSection
    section="tokens"
    tokens={tokens.tokens}
    onSectionInit={onSectionInit}
    onTokenSelect={onTokenSelect}
  />
);

TokensList.propTypes = {
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
};

export default TokensList;
