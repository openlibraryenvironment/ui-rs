import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, Row } from '@folio/stripes/components';

import { TokensSection } from '@folio/stripes-template-editor';

const TokensList = ({ tokens, onSectionInit, onTokenSelect }) => (
  <Row>
    <Col xs={4}>
      <TokensSection
        section="request"
        header={<FormattedMessage id="ui-rs.settings.notices.requestTokenHeader" />}
        tokens={tokens.request}
        onSectionInit={onSectionInit}
        onTokenSelect={onTokenSelect}
      />
    </Col>
    <Col xs={4}>
      <TokensSection
        section="item"
        header={<FormattedMessage id="ui-rs.settings.notices.itemTokenHeader" />}
        tokens={tokens.item}
        onSectionInit={onSectionInit}
        onTokenSelect={onTokenSelect}
      />
    </Col>
    <Col xs={4}>
      <TokensSection
        section="user"
        header={<FormattedMessage id="ui-rs.settings.notices.userTokenHeader" />}
        tokens={tokens.user}
        onSectionInit={onSectionInit}
        onTokenSelect={onTokenSelect}
      />
    </Col>
  </Row>
);

TokensList.propTypes = {
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
};

export default TokensList;
