import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, Row } from '@folio/stripes/components';

import { TokensSection } from '@folio/stripes-template-editor';

const TokensList = ({ tokens, onSectionInit, onTokenSelect }) => (
  <>
    <Row>
      <Col xs={4}>
        <TokensSection
          section="locations"
          header={<FormattedMessage id="ui-rs.settings.templates.pullslipTemplate.locationsHeader" />}
          tokens={tokens.locations}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
      <Col xs={4}>
        <TokensSection
          section="pendingRequests"
          header={<FormattedMessage id="ui-rs.settings.templates.pullslipTemplate.pendingRequestsHeader" />}
          tokens={tokens.pendingRequests}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
      <Col xs={4}>
        <TokensSection
          section="numRequests"
          header={<FormattedMessage id="ui-rs.settings.templates.pullslipTemplate.numRequestsHeader" />}
          tokens={tokens.numRequests}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={4}>
        <TokensSection
          section="summary"
          header={<FormattedMessage id="ui-rs.settings.templates.pullslipTemplate.summaryHeader" />}
          tokens={tokens.summary}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
      <Col xs={4}>
        <TokensSection
          section="foliourl"
          header={<FormattedMessage id="ui-rs.settings.templates.pullslipTemplate.foliourlHeader" />}
          tokens={tokens.foliourl}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
    </Row>
  </>
);

TokensList.propTypes = {
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
};

export default TokensList;
