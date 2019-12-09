import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stringify from 'json-stable-stringify';
import { AccordionSet, Accordion } from '@folio/stripes/components';

import {
  RequestInfo,
  RequestingInstitutionInfo,
  RequestingUserInfo,
  CitationMetadataInfo,
  CatalogInfo,
  SuppliersInfo,
} from './sections';

const ViewPatronRequest = ({ record }) => (
  <AccordionSet>
    {/* No card */}
    <Accordion label={<FormattedMessage id="ui-rs.information.heading.request" />}>
      <RequestInfo id="requestInfo" record={record} />
    </Accordion>
    {/* Blue card */}
    <Accordion id="requestingInstitutionInfo" label={<FormattedMessage id="ui-rs.information.heading.requestinginstitution" closedByDefault />}>
      <RequestingInstitutionInfo id="requestingInstitutionInfo" record={record} />
    </Accordion>
    {/* Gold card */}
    <Accordion id="requestingUserInfo" label={<FormattedMessage id="ui-rs.information.heading.requester" closedByDefault />}>
      <RequestingUserInfo id="requestingUserInfo" record={record} />
    </Accordion>
    {/* Pink card */}
    <Accordion id="citationMetadataInfo" label={<FormattedMessage id="ui-rs.information.heading.citationMetadata" closedByDefault />}>
      <CitationMetadataInfo id="citationMetadataInfo" record={record} />
    </Accordion>
    {/* Pale green card */}
    <Accordion id="catalogInfo" label={<FormattedMessage id="ui-rs.information.heading.catalogInfo" />}>
      <CatalogInfo id="catalogInfo" record={record} />
    </Accordion>
    {/* Green card */}
    <Accordion id="suppliersInfo" label={<FormattedMessage id="ui-rs.information.heading.suppliers" />}>
      <SuppliersInfo id="suppliersInfo" record={record} />
    </Accordion>
    {/* No card */}
    <Accordion
      id="developerInfo"
      closedByDefault
      label={<FormattedMessage id="ui-rs.information.heading.developer" />}
      displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
    >
      <pre>{stringify(record, { space: 2 })}</pre>
    </Accordion>
  </AccordionSet>
);

ViewPatronRequest.propTypes = {
  record: PropTypes.object,
};

export default ViewPatronRequest;
