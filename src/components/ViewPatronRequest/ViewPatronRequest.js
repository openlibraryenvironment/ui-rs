import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  <React.Fragment>
    <AccordionSet>
      {/* No card */}
      <RequestInfo id="requestInfo" record={record} />
      {/* Blue card */}
      <RequestingInstitutionInfo id="requestingInstitutionInfo" closedByDefault record={record} />
      {/* Gold card */}
      <RequestingUserInfo id="requestingUserInfo" closedByDefault record={record} />
      {/* Pink card */}
      <CitationMetadataInfo id="citationMetadataInfo" closedByDefault record={record} />
      {/* Pale green card */}
      <CatalogInfo id="catalogInfo" record={record} />
      {/* Green card */}
      <SuppliersInfo id="suppliersInfo" record={record} />
      {/* No card */}
      <Accordion
        id="developerInfo"
        closedByDefault
        label={<FormattedMessage id="ui-rs.information.heading.developer" />}
        displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
      >
        <pre>{JSON.stringify(record, null, 2)}</pre>
      </Accordion>
    </AccordionSet>
  </React.Fragment>
);

ViewPatronRequest.propTypes = {
  record: PropTypes.object,
};

export default ViewPatronRequest;
