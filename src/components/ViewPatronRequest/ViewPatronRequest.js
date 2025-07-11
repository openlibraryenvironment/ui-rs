import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import stringify from 'json-stable-stringify';
import { useStripes } from '@folio/stripes/core';
import { AccordionSet, Accordion } from '@folio/stripes/components';
import { useSetting } from '@projectreshare/stripes-reshare';
import { CatalogInfo } from '@projectreshare/stripes-reshare/cards';
import AppNameContext from '../../AppNameContext';

import {
  RequestInfo,
  RequestingInstitutionInfo,
  RequestingUserInfo,
  CitationMetadataInfo,
  SuppliersInfo,
  AuditInfo,
  ProtocolInfo,
  CustomIdentifiersInfo,
} from './sections';

const ViewPatronRequest = ({ record }) => {
  const location = useLocation();
  const stripes = useStripes();

  const scrollToRef = (ref) => {
    return (
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
    );
  };
  const auditRef = useRef(null);

  useEffect(() => {
    const executeScrollToAuditLog = () => scrollToRef(auditRef);
    if (location?.state?.scrollToAuditTrail) {
      executeScrollToAuditLog();
    }
  }, [location.state]);

  const routingAdapterSetting = useSetting('routing_adapter');
  const brokerLink = routingAdapterSetting.value === 'disabled' ? (
    <a
      href={`${stripes?.okapi?.url}/broker/ill_transactions?requester_req_id=${record?.hrid}~norota`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Broker Transaction Log
    </a>
  ) : null;

  if (!routingAdapterSetting.isSuccess) {
    return null;
  }

  return (
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
      <AppNameContext.Consumer>
        {appName => (
          appName === 'supply' ? '' :
          <Accordion id="requestingUserInfo" label={<FormattedMessage id="ui-rs.information.heading.requester" closedByDefault />}>
            <RequestingUserInfo id="requestingUserInfo" record={record} />
          </Accordion>
        )}
      </AppNameContext.Consumer>
      {/* Pink card */}
      <Accordion id="customIdentifiers" label={<FormattedMessage id="ui-rs.information.heading.customIdentifiers" closedByDefault />}>
        <CustomIdentifiersInfo id="customIdentifiersInfo" record={record} />
      </Accordion>
      {/* Pink card */}
      <Accordion id="citationMetadataInfo" label={<FormattedMessage id="ui-rs.information.heading.citationMetadata" closedByDefault />}>
        <CitationMetadataInfo id="citationMetadataInfo" record={record} />
      </Accordion>
      {/* Pale green card */}
      <Accordion id="catalogInfo" label={<FormattedMessage id="ui-rs.information.heading.catalogInfo" />}>
        <CatalogInfo id="catalogInfo" request={record} />
      </Accordion>
      {/* Green card */}
      <AppNameContext.Consumer>
        {appName => (
          appName === 'supply' ? '' :
          <Accordion id="suppliersInfo" label={<FormattedMessage id="ui-rs.information.heading.suppliers" />}>
            <SuppliersInfo id="suppliersInfo" record={record} />
          </Accordion>
        )}
      </AppNameContext.Consumer>
      {/* Purple card--div to hold scrolling ref */}
      <div ref={auditRef}>
        <Accordion id="auditInfo" label={<FormattedMessage id="ui-rs.information.heading.audit" />}>
          { record.isRequester && brokerLink }
          <AuditInfo id="auditInfo" record={record} />
        </Accordion>
      </div>
      <div>
        <Accordion id="protocolInfo" closedByDefault label={<FormattedMessage id="ui-rs.information.heading.protocol" />}>
          <ProtocolInfo id="protocolInfo" record={record} />
        </Accordion>
      </div>
      {/* No card */}
      {!stripes.config.showDevInfo ? '' :
      <Accordion
        id="developerInfo"
        closedByDefault
        label={<FormattedMessage id="ui-rs.information.heading.developer" />}
        displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
      >
        <pre>{stringify(record, { space: 2 })}</pre>
      </Accordion>
      }
    </AccordionSet>
  );
};

export default ViewPatronRequest;
